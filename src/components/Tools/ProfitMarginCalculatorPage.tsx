import { useState } from 'react';
import { RefreshCw, BarChart2, Wrench } from 'lucide-react';
import AccordionItem from '../../components/AccordionItem';

const faqData = [
  {
    question: "What is a 30% margin on $100?",
    answer: "A 30% profit margin on a $100 sale price means your profit is $30. This implies that the cost of the item was $70. The formula is: `Profit = Sale Price × Profit Margin` ($100 × 0.30 = $30)."
  },
  {
    question: "What is the formula for profit %?",
    answer: "The formula for profit margin percentage is: `Profit Margin % = ((Sale Price - Cost of Goods) / Sale Price) × 100`. Our calculator simplifies this process for you."
  },
  {
    question: "Is a 33% profit margin good?",
    answer: "Whether a 33% profit margin is good depends heavily on your industry, business model, and operating costs. For many retail businesses, a 33% gross margin is considered healthy as it provides a solid buffer to cover overhead and still generate a net profit."
  },
  {
    question: "Why is profit margin important?",
    answer: "Profit margin is a critical indicator of a company's financial health. It shows how much profit you generate for each dollar of revenue, which is essential for covering costs, investing in growth, and ensuring long-term sustainability."
  },
  {
    question: "How do I calculate my profit margin?",
    answer: "You can use the formula: `Profit Margin = ((Revenue - Cost) / Revenue) * 100`. Simply subtract your costs from your revenue, divide by the revenue, and multiply by 100. Our tool above automates this calculation for you."
  },
  {
    question: "Does profit margin include taxes?",
    answer: "It depends on the type of margin. **Gross profit margin** and **operating profit margin** do not include taxes. However, **net profit margin** (the 'bottom line') is calculated after all expenses, including taxes, have been deducted."
  },
  {
    question: "Can profit margin be negative?",
    answer: "Yes, a negative profit margin occurs when your costs are higher than your revenue. This indicates a loss on the sale and is a clear sign that you need to adjust your pricing or reduce costs."
  },
  {
    question: "How to calculate profit margin formula?",
    answer: "The most common profit margin formula is for net profit margin: `(Net Profit / Revenue) * 100`. For a single product, it's typically calculated as `((Selling Price - Cost) / Selling Price) * 100` to find the gross profit margin."
  }
];

const ProfitMarginCalculatorPage = () => {
  const [cost, setCost] = useState('');
  const [markup, setMarkup] = useState('');
  const [results, setResults] = useState({
    salePrice: 0,
    grossProfit: 0,
    profitMargin: 0,
  });
  const [isCalculated, setIsCalculated] = useState(false);

  const calculateProfit = () => {
    const costValue = parseFloat(cost);
    const markupValue = parseFloat(markup);

    if (isNaN(costValue) || isNaN(markupValue) || costValue < 0 || markupValue < 0) {
      alert('Please enter valid positive numbers for cost and markup.');
      return;
    }

    const salePrice = costValue * (1 + markupValue / 100);
    const grossProfit = salePrice - costValue;
    const profitMargin = (grossProfit / salePrice) * 100;

    setResults({
      salePrice,
      grossProfit,
      profitMargin,
    });
    setIsCalculated(true);
  };

  const handleReset = () => {
    setCost('');
    setMarkup('');
    setIsCalculated(false);
    setResults({
      salePrice: 0,
      grossProfit: 0,
      profitMargin: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f5fa] to-[#e6e9f8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-pink-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <Wrench className="w-4 h-4 mr-2" />
            Free tools
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1e204f] mb-3">
            Profit Margin Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Set optimal product prices and enhance your profit margin
          </p>
        </div>

        {/* Calculator */}
        <div className="bg-white rounded-2xl shadow-xl p-8 grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#1e204f] flex items-center">
              Input Values
            </h2>

            <div>
              <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                Cost of item
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="cost"
                  id="cost"
                  className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter cost"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="markup" className="block text-sm font-medium text-gray-700 mb-1">
                Markup percentage
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
                <input
                  type="number"
                  name="markup"
                  id="markup"
                  className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter markup"
                  value={markup}
                  onChange={(e) => setMarkup(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center justify-center w-full rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Reset
              </button>
              <button
                type="button"
                onClick={calculateProfit}
                className="flex items-center justify-center w-full rounded-md border border-transparent bg-[#1e204f] px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Calculate Profit
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-8 flex flex-col justify-center">
            <h2 className="text-xl font-bold text-[#1e204f] flex items-center mb-6">
              <BarChart2 className="w-6 h-6 mr-2" />
              Results
            </h2>
            {isCalculated ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Sale Price:</span>
                  <span className="font-bold text-lg text-gray-900">${results.salePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Gross Profit:</span>
                  <span className="font-bold text-lg text-green-600">${results.grossProfit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Profit Margin:</span>
                  <span className="font-bold text-lg text-blue-600">{results.profitMargin.toFixed(2)}%</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>Enter your values and calculate to see results</p>
              </div>
            )}
          </div>
        </div>

        {/* Blog Post Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mt-12">
          <div className="prose prose-indigo max-w-none">
            <h2 className="text-3xl font-bold text-[#1e204f]">Understanding the Devnzo Profit Margin Calculator</h2>
            <p>
              The <strong>Devnzo Profit Margin Calculator</strong> is a free tool designed to help businesses determine optimal product pricing by calculating profit margins based on cost and markup percentage. Whether you're pricing new products or evaluating your current strategy, this tool gives you the insights needed to maximize profitability.
            </p>

            <h3>How to Use the Calculator</h3>
            <ol>
              <li><strong>Enter the product cost:</strong> Input the total cost of one unit of your product.</li>
              <li><strong>Input the desired markup percentage:</strong> Add the percentage you want to mark up the cost by.</li>
              <li><strong>Click "Calculate Profit":</strong> Instantly see the selling price, gross profit per unit, and your profit margin percentage.</li>
              <li><strong>Reset and experiment:</strong> Use the reset button to try different scenarios and find the perfect pricing for your store.</li>
            </ol>

            <h3 className="!mb-0">Five Types of Profit Margins</h3>
            <p className="!mt-2">Each of these margins provides a different view of your company's financial health.</p>
            <div className="space-y-4">
              <details className="p-4 border rounded-lg" open>
                <summary className="font-semibold cursor-pointer">1. Gross Profit Margin</summary>
                <p className="mt-2">Measures the profitability of a specific product. It shows how much profit you make from selling that item before other expenses are deducted.</p>
                <code>Formula: (Gross Profit / Net Revenue) x 100</code>
              </details>
              <details className="p-4 border rounded-lg">
                <summary className="font-semibold cursor-pointer">2. Operating Profit Margin</summary>
                <p className="mt-2">Indicates how much profit a company makes from its core business operations, excluding interest and taxes.</p>
                <code>Formula: (Operating Income / Revenue) x 100</code>
              </details>
              <details className="p-4 border rounded-lg">
                <summary className="font-semibold cursor-pointer">3. Net Profit Margin</summary>
                <p className="mt-2">This is the "bottom line" and shows the percentage of revenue left after all expenses, including taxes and interest, have been deducted from revenue.</p>
                <code>Formula: (Net Income / Revenue) x 100</code>
              </details>
              <details className="p-4 border rounded-lg">
                <summary className="font-semibold cursor-pointer">4. EBITDA Margin</summary>
                <p className="mt-2">Measures a company's operating profit as a percentage of its revenue, before interest, taxes, depreciation, and amortization.</p>
                <code>Formula: (EBITDA / Revenue) x 100</code>
              </details>
              <details className="p-4 border rounded-lg">
                <summary className="font-semibold cursor-pointer">5. Contribution Margin</summary>
                <p className="mt-2">Reveals the amount of revenue available to cover fixed costs after variable costs have been paid.</p>
                <code>Formula: (Revenue - Variable Costs) / Revenue</code>
              </details>
            </div>
            
            <h3 className="mt-8">Six Strategies to Improve Your Profit Margin</h3>
            <ul>
              <li><strong>Cut Operating Costs:</strong> Regularly review your expenses and identify areas where you can reduce costs without sacrificing quality.</li>
              <li><strong>Increase Average Order Value (AOV):</strong> Encourage customers to buy more in a single transaction through upselling, cross-selling, and product bundles.</li>
              <li><strong>Improve Inventory Management:</strong> Avoid overstocking and understocking to reduce holding costs and lost sales.</li>
              <li><strong>Automate Tasks:</strong> Use technology to automate repetitive tasks, freeing up time to focus on strategic growth activities.</li>
              <li><strong>Optimize Pricing:</strong> Regularly analyze your pricing strategy against market trends, competitor pricing, and perceived value.</li>
              <li><strong>Focus on Customer Retention:</strong> Retaining existing customers is often more cost-effective than acquiring new ones. Implement loyalty programs and provide excellent customer service.</li>
            </ul>

            <p>
              If you're pricing products or running a store—especially on Shopify—this tool is a helpful, practical resource for making informed financial decisions.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mt-12">
          <h2 className="text-3xl font-bold text-[#1e204f] mb-6">Profit Margin Calculator: FAQs</h2>
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

export default ProfitMarginCalculatorPage; 