import { useState } from 'react';
import { RefreshCw, BarChart2, Wrench } from 'lucide-react';
import AccordionItem from '../../components/AccordionItem';

const faqData = [
  {
    question: "What is ROI and why is it important?",
    answer: "Return on Investment (ROI) is a metric used to evaluate the profitability of an investment. It's important because it provides a simple, standardized way to compare the returns of different investments, helping you make more informed financial decisions."
  },
  {
    question: "What is the difference between ROI and Annualized ROI?",
    answer: "ROI measures the total return over the entire investment period, regardless of its length. Annualized ROI, however, expresses the return as an annual rate, which makes it much more effective for comparing investments held over different time periods."
  },
  {
    question: "What is a 'good' ROI?",
    answer: "A 'good' ROI is subjective and depends heavily on the industry, risk level, and economic climate. Generally, an annualized ROI of 7-10% (tracking the market average) is considered good, while anything higher is excellent. However, high-risk investments should be expected to yield a much higher ROI to be considered worthwhile."
  },
  {
    question: "Can ROI be negative?",
    answer: "Absolutely. A negative ROI occurs when the amount returned from an investment is less than the amount invested, resulting in a financial loss."
  },
  {
    question: "What are the limitations of using ROI?",
    answer: "The main limitation of standard ROI is that it doesn't account for the time period of an investment. An ROI of 50% over one year is far better than an ROI of 50% over ten years. This is why our calculator also provides the Annualized ROI for a more accurate comparison. Additionally, ROI doesn't account for risk."
  }
];

const RoiCalculatorPage = () => {
  const [invested, setInvested] = useState('');
  const [returned, setReturned] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [results, setResults] = useState({
    gain: 0,
    roi: 0,
    annualizedRoi: 0,
    length: 0,
  });
  const [isCalculated, setIsCalculated] = useState(false);

  const calculateRoi = () => {
    const investedValue = parseFloat(invested);
    const returnedValue = parseFloat(returned);

    if (isNaN(investedValue) || isNaN(returnedValue) || !startDate || !endDate) {
      alert('Please fill in all fields with valid values.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      alert('The "To" date must be later than the "From" date.');
      return;
    }

    const gain = returnedValue - investedValue;
    const roi = (gain / investedValue) * 100;
    
    const lengthInDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    const lengthInYears = lengthInDays / 365.25;

    const annualizedRoi = (Math.pow((returnedValue / investedValue), (1 / lengthInYears)) - 1) * 100;

    setResults({
      gain,
      roi,
      annualizedRoi,
      length: lengthInYears,
    });
    setIsCalculated(true);
  };

  const handleReset = () => {
    setInvested('');
    setReturned('');
    setStartDate('');
    setEndDate('');
    setIsCalculated(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f5fa] to-[#e6e9f8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-pink-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <Wrench className="w-4 h-4 mr-2" />
            Free tools
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1e204f] mb-3">Return on Investment (ROI) Calculator</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#1e204f]">Input Values</h2>
            <div>
              <label htmlFor="invested" className="block text-sm font-medium text-gray-700 mb-1">Amount Invested</label>
              <input type="number" id="invested" value={invested} onChange={(e) => setInvested(e.target.value)} className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="e.g., 1000" />
            </div>
            <div>
              <label htmlFor="returned" className="block text-sm font-medium text-gray-700 mb-1">Amount Returned</label>
              <input type="number" id="returned" value={returned} onChange={(e) => setReturned(e.target.value)} className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="e.g., 2000" />
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Investment Time: From</label>
              <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="flex items-center gap-4 pt-4">
              <button onClick={handleReset} className="flex items-center justify-center w-full rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                <RefreshCw className="w-5 h-5 mr-2" /> Reset
              </button>
              <button onClick={calculateRoi} className="flex items-center justify-center w-full rounded-md border border-transparent bg-[#1e204f] px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-opacity-90">
                Calculate
              </button>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-8 flex flex-col justify-center">
            <h2 className="text-xl font-bold text-[#1e204f] flex items-center mb-6">
              <BarChart2 className="w-6 h-6 mr-2" /> Results
            </h2>
            {isCalculated ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="font-medium text-gray-600">Investment Gain:</span><span className="font-bold text-lg text-green-600">${results.gain.toFixed(2)}</span></div>
                <div className="flex justify-between items-center"><span className="font-medium text-gray-600">ROI:</span><span className="font-bold text-lg text-blue-600">{results.roi.toFixed(2)}%</span></div>
                <div className="flex justify-between items-center"><span className="font-medium text-gray-600">Annualized ROI:</span><span className="font-bold text-lg text-purple-600">{results.annualizedRoi.toFixed(2)}%</span></div>
                 <div className="flex justify-between items-center"><span className="font-medium text-gray-600">Investment Length:</span><span className="font-bold text-lg text-gray-900">{results.length.toFixed(2)} years</span></div>
              </div>
            ) : (
              <div className="text-center text-gray-500"><p>Enter your values and calculate to see results</p></div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mt-12">
          <div className="prose prose-indigo max-w-none">
            <h2 className="text-3xl font-bold text-[#1e204f]">What is Return on Investment (ROI)?</h2>
            <p>In finance, Return on Investment, usually abbreviated as ROI, is a common, widespread metric used to evaluate the forecasted profitability on different investments. The metric can be applied to anything from stocks, real estate, employees, to even a sheep farm; anything that has a cost with the potential to derive gains from can have an ROI assigned to it. While much more intricate formulas exist, ROI is lauded for its simplicity and broad usage as a quick-and-dirty method.</p>
            <h3>The Basic Formula</h3>
            <p><code>ROI = (Gain from Investment - Cost of Investment) / Cost of Investment</code></p>
            <p>As a most basic example, if you invested $50,000 into a project and your total profits to date sum up to $70,000, your ROI would be 40%.</p>
            <h3>Difficulty in Usage</h3>
            <p>The biggest nuance with ROI is that there is no timeframe involved. An ROI of 50% over one year is much better than the same ROI over ten years. This is why it's essential to supplement it with other, more accurate measures.</p>
            <h3>Annualized ROI</h3>
            <p>Our ROI Calculator includes an Investment Time input to hurdle this weakness by using annualized ROI, which is a rate normally more meaningful for comparison. When comparing the results of two calculations, the annualized ROI figure is often more useful than the standard ROI figure.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mt-12">
          <h2 className="text-3xl font-bold text-[#1e204f] mb-6">ROI Calculator: FAQs</h2>
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

export default RoiCalculatorPage; 