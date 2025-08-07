// app/api/sync/stripe-direct/route.ts
// Create this new route for testing with direct Stripe account (no Connect)

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Lazy initialization to avoid build-time errors
let supabase: ReturnType<typeof createClient> | null = null;
let stripe: Stripe | null = null;

function getSupabase() {
  if (!supabase) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return supabase;
}

function getStripe() {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-07-30.basil',
    });
  }
  return stripe;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'Missing userId parameter' },
      { status: 400 }
    );
  }

  try {
    console.log('🔄 Starting direct Stripe sync for user:', userId);

    const supabaseClient = getSupabase();
    const stripeClient = getStripe();

    // Step 1: Ensure user has a connected account record
    const { data: existingAccount, error: accountError } = await supabaseClient
      .from('connected_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', 'stripe')
      .eq('account_name', 'Direct Stripe Account')
      .single();

    let connectedAccount = existingAccount;

    if (accountError || !connectedAccount) {
      // Create a connected account record for direct stripe access
      const { data: newAccount, error: createError } = await supabaseClient
        .from('connected_accounts')
        .insert([{
          user_id: userId,
          platform: 'stripe',
          account_name: 'Direct Stripe Account',
          account_id: 'acct_1Rt85oCaErB2ZgBF', // Your actual Stripe account ID
          status: 'active',
        }])
        .select()
        .single();

      if (createError) {
        console.error('Failed to create account record:', createError);
        return NextResponse.json(
          { error: 'Failed to create account record' },
          { status: 500 }
        );
      }

      connectedAccount = newAccount;
      console.log('✅ Created connected account record:', connectedAccount.id);
    }

    // Step 2: Fetch balance transactions directly (no connected account)
    const balanceTransactions = await stripeClient.balanceTransactions.list({
      limit: 100,
      // Get all transactions for testing
    });

    console.log(`📊 Found ${balanceTransactions.data.length} balance transactions`);

    if (balanceTransactions.data.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No transactions found',
        synced: 0
      });
    }

    // Process transactions
    const transactionsToInsert = [];
    
    for (const transaction of balanceTransactions.data) {
      // Categorize transaction
      const { type, category } = categorizeStripeTransaction(transaction);
      
      // Main transaction
      transactionsToInsert.push({
        user_id: userId,
        account_id: connectedAccount.id, // Use the proper UUID
        platform: 'stripe',
        external_id: transaction.id,
        amount: Math.abs(transaction.amount) / 100, // Convert from cents, always positive
        currency: transaction.currency.toUpperCase(),
        type,
        category,
        description: transaction.description || `${transaction.type}`,
        date: new Date(transaction.created * 1000).toISOString().split('T')[0],
        raw_data: transaction,
      });

      // Add fee as separate expense if it exists
      if (transaction.fee > 0) {
        transactionsToInsert.push({
          user_id: userId,
          account_id: connectedAccount.id, // Use the proper UUID
          platform: 'stripe',
          external_id: `${transaction.id}_fee`,
          amount: transaction.fee / 100,
          currency: transaction.currency.toUpperCase(),
          type: 'expense',
          category: 'Processing Fees',
          description: `Processing fee for ${transaction.description || transaction.type}`,
          date: new Date(transaction.created * 1000).toISOString().split('T')[0],
          raw_data: { ...transaction, _fee_transaction: true },
        });
      }
    }

    console.log(`📝 Processing ${transactionsToInsert.length} transactions (including fees)`);

    // Insert into database
    const { data: insertedData, error: insertError } = await supabaseClient
      .from('transactions')
      .upsert(transactionsToInsert, {
        onConflict: 'platform,external_id',
        ignoreDuplicates: false,
      })
      .select();

    if (insertError) {
      console.error('❌ Database error:', insertError);
      return NextResponse.json(
        { 
          error: 'Failed to save transactions',
          details: insertError.message
        },
        { status: 500 }
      );
    }

    console.log(`✅ Successfully inserted ${insertedData?.length || 0} transactions`);

    // Calculate metrics for response
    const income = transactionsToInsert
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactionsToInsert
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return NextResponse.json({
      success: true,
      synced: transactionsToInsert.length,
      metrics: {
        income: income,
        expenses: expenses,
        profit: income - expenses,
        transactionCount: transactionsToInsert.length,
      },
      message: `Successfully synced ${transactionsToInsert.length} transactions`,
    });

  } catch (error) {
    console.error('❌ Sync failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to categorize Stripe transactions
function categorizeStripeTransaction(transaction: Stripe.BalanceTransaction): {
  type: string;
  category: string;
} {
  switch (transaction.type) {
    case 'charge':
    case 'payment':
      return {
        type: 'income',
        category: 'Sales Revenue',
      };
    
    case 'payment_refund':
    case 'refund':
      return {
        type: 'expense',
        category: 'Refunds',
      };

    case 'payout':
      return {
        type: 'transfer',
        category: 'Bank Transfer',
      };

    case 'application_fee':
      return {
        type: 'expense',
        category: 'Platform Fees',
      };

    case 'adjustment':
      return {
        type: transaction.amount >= 0 ? 'income' : 'expense',
        category: 'Adjustments',
      };

    default:
      return {
        type: transaction.amount >= 0 ? 'income' : 'expense',
        category: 'Other',
      };
  }
}