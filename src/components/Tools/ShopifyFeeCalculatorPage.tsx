import { useState, useEffect } from 'react';
import { Wrench } from 'lucide-react';
import AccordionItem from '../../components/AccordionItem';
import React from 'react';
const planData = {
    basic: {
        monthly: 29,
        yearly: 29 * 12 * 0.75,
        ccRatePercent: 2.9,
        ccRateFixed: 0.30,
        transactionFeePercent: 2.0,
    },
    shopify: {
        monthly: 79,
        yearly: 79 * 12 * 0.75,
        ccRatePercent: 2.6,
        ccRateFixed: 0.30,
        transactionFeePercent: 1.0,
    },
    advanced: {
        monthly: 299,
        yearly: 299 * 12 * 0.75,
        ccRatePercent: 2.4,
        ccRateFixed: 0.30,
        transactionFeePercent: 0.5,
    }
};

const faqData = [
    {
        question: "Should I always pick the lowest-cost Shopify plan?",
        answer: "Not necessarily. While our calculator helps you see the costs, higher-tier plans offer lower transaction fees and more advanced features (like better reporting and shipping discounts) that can be more cost-effective for high-volume stores."
    },
    {
        question: "Is Shopify suitable for beginners?",
        answer: "Yes, Shopify is known for its user-friendly interface, making it one of the best platforms for beginners to set up an online store without needing coding experience."
    },
    {
        question: "Are there any hidden fees with Shopify?",
        answer: "Shopify is transparent about its fees. However, you should account for additional costs from third-party apps, premium themes, and external payment gateway fees, which are not part of Shopify's core charges."
    },
    {
        question: "What happens if I don't make any sales?",
        answer: "You will still be charged your monthly Shopify subscription fee, regardless of sales activity. However, transaction and payment processing fees are only incurred when you make a sale."
    }
];

const ShopifyFeeCalculatorPage = () => {
    const [ordersPerMonth, setOrdersPerMonth] = useState('10');
    const [avgOrderValue, setAvgOrderValue] = useState('100');
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [usingShopifyPayments, setUsingShopifyPayments] = useState('yes');
    const [externalGatewayPercent, setExternalGatewayPercent] = useState('2');
    const [externalGatewayFixed, setExternalGatewayFixed] = useState('0.2');

    const [results, setResults] = useState({ basic: {}, shopify: {}, advanced: {} });

    useEffect(() => {
        const orders = parseFloat(ordersPerMonth) || 0;
        const avgValue = parseFloat(avgOrderValue) || 0;
        const monthlyRevenue = orders * avgValue;

        const externalPercent = parseFloat(externalGatewayPercent) / 100 || 0;
        const externalFixed = parseFloat(externalGatewayFixed) || 0;

        const calculatePlan = (plan) => {
            const planFee = billingCycle === 'monthly' ? plan.monthly : plan.yearly / 12;

            let shopifyPaymentFee = 0;
            let externalPaymentFee = 0;
            let transactionFee = 0;

            if (usingShopifyPayments === 'yes') {
                shopifyPaymentFee = (monthlyRevenue * (plan.ccRatePercent / 100)) + (orders * plan.ccRateFixed);
            } else {
                externalPaymentFee = (monthlyRevenue * externalPercent) + (orders * externalFixed);
                transactionFee = monthlyRevenue * (plan.transactionFeePercent / 100);
            }

            const totalCost = planFee + shopifyPaymentFee + externalPaymentFee + transactionFee;

            return {
                totalCost,
                planFee,
                shopifyPaymentFee,
                externalPaymentFee,
                transactionFee,
                ccRateFormatted: `${plan.ccRatePercent}% + ${plan.ccRateFixed.toFixed(2)}$`
            };
        };

        setResults({
            basic: calculatePlan(planData.basic),
            shopify: calculatePlan(planData.shopify),
            advanced: calculatePlan(planData.advanced)
        });

    }, [ordersPerMonth, avgOrderValue, billingCycle, usingShopifyPayments, externalGatewayPercent, externalGatewayFixed]);

    const PlanResultCard = ({ name, data }) => (
        <div className="bg-gray-50 rounded-lg p-6 text-center border">
            <h3 className="text-xl font-bold text-blue-600 mb-4">{name}</h3>
            <p className="text-4xl font-bold text-gray-800 mb-6">${data.totalCost?.toFixed(2)}</p>
            <div className="space-y-3 text-left text-sm">
                <div className="flex justify-between"><span>Plan fee</span><strong>${data.planFee?.toFixed(2)}</strong></div>
                <div className="flex justify-between"><span>External payment fees</span><strong>${data.externalPaymentFee?.toFixed(2)}</strong></div>
                <div className="flex justify-between"><span>Shopify payment fee</span><strong>${data.shopifyPaymentFee?.toFixed(2)} <span className="text-xs text-gray-500">({data.ccRateFormatted})</span></strong></div>
                <div className="flex justify-between"><span>Transaction fee</span><strong>{data.transactionFee > 0 ? `$${data.transactionFee.toFixed(2)}` : 'None'}</strong></div>
            </div>
            <button className="mt-6 bg-blue-600 text-white w-full py-2 rounded-lg font-semibold hover:bg-blue-700">Start now</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Shopify Fee Calculator: How Much Does A Shopify Store Cost?</h1>
                    <p className="text-gray-500">By Devnzo | January 19, 2026 | 5 min read</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
                        <div>
                            <label className="font-semibold">Order per month:</label>
                            <input type="number" value={ordersPerMonth} onChange={(e) => setOrdersPerMonth(e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="font-semibold">Average order value:</label>
                            <input type="number" value={avgOrderValue} onChange={(e) => setAvgOrderValue(e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                        <div className="flex items-center space-x-2 mt-6">
                            <span>Monthly</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={billingCycle === 'yearly'} onChange={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')} className="sr-only peer" />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                            <span>Yearly <span className="text-green-600 font-semibold">SAVE 25%</span></span>
                        </div>
                        <div></div>
                        <div>
                            <label className="font-semibold">Using Shopify payment?</label>
                            <div className="flex items-center space-x-4 mt-2">
                                <label><input type="radio" value="yes" checked={usingShopifyPayments === 'yes'} onChange={(e) => setUsingShopifyPayments(e.target.value)} /> Yes, I do</label>
                                <label><input type="radio" value="no" checked={usingShopifyPayments === 'no'} onChange={(e) => setUsingShopifyPayments(e.target.value)} /> No, I don't</label>
                            </div>
                        </div>
                        {usingShopifyPayments === 'no' && (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3">
                                <label className="font-semibold">External payment gateway fees:</label>
                                <div className="flex items-center space-x-2 mt-1">
                                    <input type="number" value={externalGatewayPercent} onChange={(e) => setExternalGatewayPercent(e.target.value)} className="w-20 p-2 border rounded-md" />
                                    <span>% +</span>
                                    <input type="number" value={externalGatewayFixed} onChange={(e) => setExternalGatewayFixed(e.target.value)} className="w-20 p-2 border rounded-md" />
                                    <span>$</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1 py-8">
                        <h2 className="text-2xl font-bold mb-2">Total Cost</h2>
                        <p className="text-gray-500">Plan fee</p>
                        <p className="text-gray-500">External payment fees</p>
                        <p className="text-gray-500">Shopify payment fee</p>
                        <p className="text-gray-500">Transaction fee</p>
                    </div>
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <PlanResultCard name="Basic Plan" data={results.basic} />
                        <PlanResultCard name="Shopify Plan" data={results.shopify} />
                        <PlanResultCard name="Advanced Plan" data={results.advanced} />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mt-12 border">
                    <div className="prose prose-indigo max-w-none">
                        <h2 className="text-3xl font-bold">What Is The Shopify Fee Calculator?</h2>
                        <p>The Shopify fee calculator is a helpful tool that estimates how much Shopify retailers would pay corresponding to each Shopify plan and helps them decide which will make the most financial sense.</p>

                        <h3>How To Use The Shopify Pricing Calculator</h3>
                        <ol>
                            <li><strong>Choose monthly or yearly fees:</strong> Use the toggle to see how much you can save with an annual plan.</li>
                            <li><strong>Select your payment method:</strong> Indicate whether you're using Shopify Payments or a third-party gateway.</li>
                            <li><strong>Enter your sales volume:</strong> Input your average order value and the number of sales you expect per month.</li>
                            <li><strong>Review your estimated costs:</strong> The calculator will break down the total fees for the Basic, Shopify, and Advanced plans.</li>
                        </ol>

                        <h3>Understanding Shopify Fees</h3>
                        <p>When using Shopify, your main costs will come from subscriptions and transaction fees.</p>
                        <h4>Primary Costs</h4>
                        <ul>
                            <li><strong>Shopify Subscription:</strong> A fixed monthly or yearly fee for using the platform. Higher-tier plans offer more features and lower transaction rates.</li>
                            <li><strong>Transaction Fees:</strong> If you don't use Shopify Payments, Shopify charges an additional fee on each sale (2% for Basic, 1% for Shopify, 0.5% for Advanced).</li>
                            <li><strong>Credit Card Rates:</strong> Both Shopify Payments and third-party gateways charge a percentage and a fixed fee to process credit card transactions.</li>
                        </ul>
                        <h4>Additional Costs</h4>
                        <ul>
                            <li><strong>Domain Name:</strong> While you get a free `.myshopify.com` domain, a custom domain (e.g., `yourstore.com`) costs about $15-$20 per year.</li>
                            <li><strong>Shopify Apps:</strong> Many apps in the Shopify App Store have monthly subscription fees, which can add up.</li>
                            <li><strong>Premium Themes:</strong> To get a unique design, you might purchase a premium theme, which is a one-time cost of around $100-$500.</li>
                        </ul>

                        <h3>Tips To Cut Down Shopify Fees</h3>
                        <ul>
                            <li><strong>Subscribe Annually:</strong> You can save up to 25% on your subscription fees by committing to an annual plan.</li>
                            <li><strong>Use Shopify Payments:</strong> If available in your country, using Shopify Payments eliminates Shopify's extra transaction fees.</li>
                            <li><strong>Choose the Right Plan:</strong> Use this calculator to ensure you're on the most cost-effective plan for your sales volume. A higher-tier plan can be cheaper if you have a high number of sales, due to the lower transaction rates.</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mt-12 border">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Shopify Fee Calculator: FAQs</h2>
                    <div className="space-y-4">
                        {faqData.map((faq, index) => (
                            <AccordionItem key={index} question={faq.question}>
                                <p>{faq.answer}</p>
                            </AccordionItem>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopifyFeeCalculatorPage; 