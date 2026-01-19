import { useState } from 'react';
import { RefreshCw, BarChart2, Wrench } from 'lucide-react';
import AccordionItem from '../../components/AccordionItem';

const faqData = [
    {
        question: "What is a business loan?",
        answer: "A business loan is a loan specifically intended for business purposes. Like other loans, it involves borrowing a sum of money that you must pay back over time with interest."
    },
    {
        question: "What's the difference between an SBA loan and a conventional loan?",
        answer: "SBA loans are guaranteed by the U.S. Small Business Administration, which reduces risk for lenders and often results in more favorable terms for borrowers. Conventional loans, typically from banks, do not have this government backing and may have stricter requirements and higher interest rates."
    },
    {
        question: "What are common fees on a business loan?",
        answer: "Common fees include an origination fee (for processing the loan), a documentation fee, and sometimes an application fee. There can also be ongoing administrative fees, late payment fees, or prepayment penalties."
    },
    {
        question: "What is APR and why is it important?",
        answer: "The Annual Percentage Rate (APR) is the true cost of a loan, including the interest rate and all associated fees, expressed as an annual percentage. It provides a more accurate picture of the loan's cost than the interest rate alone, making it essential for comparing different loan offers."
    },
    {
        question: "Can I use a personal loan for my business?",
        answer: "Yes, some business owners, especially those with new businesses, use personal loans. If you have excellent credit, you might secure a lower interest rate than with a traditional business loan. However, this means you are personally liable for the debt."
    }
];

const BusinessLoanCalculatorPage = () => {
    const [loanAmount, setLoanAmount] = useState('10000');
    const [interestRate, setInterestRate] = useState('10');
    const [compound, setCompound] = useState('monthly');
    const [loanTermYears, setLoanTermYears] = useState('5');
    const [loanTermMonths, setLoanTermMonths] = useState('0');
    const [payback, setPayback] = useState('monthly');
    const [originationFee, setOriginationFee] = useState('5');
    const [documentationFee, setDocumentationFee] = useState('750');
    const [otherFees, setOtherFees] = useState('0');

    const [results, setResults] = useState({
        paymentPerPeriod: 0,
        paymentFrequencyLabel: 'month',
        totalPayment: 0,
        totalInterest: 0,
        totalFees: 0,
        apr: 0,
        principalPercent: 0,
        interestPercent: 0,
        feePercent: 0,
    });
    const [isCalculated, setIsCalculated] = useState(false);

    const calculateLoan = () => {
        const principal = parseFloat(loanAmount);
        const annualInterestRate = parseFloat(interestRate) / 100;
        const years = parseInt(loanTermYears) || 0;
        const months = parseInt(loanTermMonths) || 0;
        const totalLoanTermInYears = years + (months / 12);

        const compoundingPeriodsPerYear = {
            'annually': 1, 'semi-annually': 2, 'quarterly': 4, 'monthly': 12,
            'semi-monthly': 24, 'biweekly': 26, 'weekly': 52, 'daily': 365
        };

        const paymentsPerYearMap = {
            'monthly': 12, 'every-day': 365, 'every-week': 52, 'every-2-weeks': 26, 
            'every-half-month': 24, 'every-quarter': 4, 'every-6-months': 2, 'every-year': 1,
            'interest-only': 12, // Assuming monthly for interest-only payments
            'in-the-end': 1
        };

        const m = compoundingPeriodsPerYear[compound];
        const p = paymentsPerYearMap[payback] || 1;

        const totalNumberOfPayments = totalLoanTermInYears * p;
        
        const origination = (parseFloat(originationFee) / 100) * principal;
        const documentation = parseFloat(documentationFee);
        const other = parseFloat(otherFees);
        const totalFees = origination + documentation + other;

        if (isNaN(principal) || isNaN(annualInterestRate) || totalLoanTermInYears <= 0) {
            alert("Please fill in all required fields with valid numbers.");
            return;
        }

        let paymentPerPeriod = 0;
        let totalPayment = 0;
        let totalInterest = 0;

        if (payback === 'in-the-end') {
            const totalCompoundingPeriods = totalLoanTermInYears * m;
            totalPayment = principal * Math.pow(1 + annualInterestRate / m, totalCompoundingPeriods);
            totalInterest = totalPayment - principal;
            paymentPerPeriod = totalPayment; // Single payment at the end
        } else {
             const effectiveRatePerPayment = Math.pow(1 + annualInterestRate / m, m / p) - 1;
             if (payback === 'interest-only') {
                 paymentPerPeriod = principal * effectiveRatePerPayment;
                 totalInterest = paymentPerPeriod * totalNumberOfPayments;
                 totalPayment = principal + totalInterest;
             }
             else {
                paymentPerPeriod = principal * (effectiveRatePerPayment / (1 - Math.pow(1 + effectiveRatePerPayment, -totalNumberOfPayments)));
                totalPayment = paymentPerPeriod * totalNumberOfPayments;
                totalInterest = totalPayment - principal;
             }
        }
        
        const totalCost = totalInterest + totalFees;
        const apr = totalLoanTermInYears > 0 ? ((totalCost / principal) / totalLoanTermInYears) * 100 : 0;
        
        const totalPaidWithFees = principal + totalInterest + totalFees;

        setResults({
            paymentPerPeriod,
            paymentFrequencyLabel: payback.replace(/-/g, ' '),
            totalPayment,
            totalInterest,
            totalFees,
            apr,
            principalPercent: (principal / totalPaidWithFees) * 100,
            interestPercent: (totalInterest / totalPaidWithFees) * 100,
            feePercent: (totalFees / totalPaidWithFees) * 100,
        });
        setIsCalculated(true);
    };

    const handleReset = () => {
        setLoanAmount('10000');
        setInterestRate('10');
        setCompound('monthly');
        setLoanTermYears('5');
        setLoanTermMonths('0');
        setPayback('monthly');
        setOriginationFee('5');
        setDocumentationFee('750');
        setOtherFees('0');
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
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1e204f] mb-3">Business Loan Calculator</h1>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 grid md:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-[#1e204f]">Input Values</h2>
                        
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <label htmlFor="loanAmount" className="font-medium text-gray-700">Loan amount</label>
                            <input type="number" id="loanAmount" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="10,000" />
                        </div>
                         <div className="grid grid-cols-2 gap-4 items-center">
                            <label htmlFor="interestRate" className="font-medium text-gray-700">Interest rate</label>
                            <div className="relative">
                                <input type="number" id="interestRate" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="block w-full rounded-md border-gray-300 pr-8 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="10" />
                                <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">%</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <label htmlFor="compound" className="font-medium text-gray-700">Compound</label>
                            <select id="compound" value={compound} onChange={(e) => setCompound(e.target.value)} className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                <option value="annually">Annually (APY)</option>
                                <option value="semi-annually">Semi-annually</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="monthly">Monthly (APR)</option>
                                <option value="semi-monthly">Semi-monthly</option>
                                <option value="biweekly">Biweekly</option>
                                <option value="weekly">Weekly</option>
                                <option value="daily">Daily</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <label htmlFor="loanTerm" className="font-medium text-gray-700">Loan term</label>
                            <div className="flex gap-2">
                                <input type="number" value={loanTermYears} onChange={(e) => setLoanTermYears(e.target.value)} className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                <span className="flex items-center text-gray-500">years</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center">
                             <label></label>
                            <div className="flex gap-2">
                                <input type="number" value={loanTermMonths} onChange={(e) => setLoanTermMonths(e.target.value)} className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                <span className="flex items-center text-gray-500">months</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <label htmlFor="payback" className="font-medium text-gray-700">Pay back</label>
                            <select id="payback" value={payback} onChange={(e) => setPayback(e.target.value)} className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                <option value="monthly">Every Month</option>
                                <option value="every-day">Every Day</option>
                                <option value="every-week">Every Week</option>
                                <option value="every-2-weeks">Every 2 Weeks</option>
                                <option value="every-half-month">Every Half Month</option>
                                <option value="every-quarter">Every Quarter</option>
                                <option value="every-6-months">Every 6 Months</option>
                                <option value="every-year">Every Year</option>
                                <option value="interest-only">Interest Only</option>
                                <option value="in-the-end">In the End</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <label htmlFor="originationFee" className="font-medium text-gray-700">Origination fee</label>
                            <div className="relative">
                                <input type="number" id="originationFee" value={originationFee} onChange={(e) => setOriginationFee(e.target.value)} className="block w-full rounded-md border-gray-300 pr-8 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="5" />
                                 <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">%</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <label htmlFor="documentationFee" className="font-medium text-gray-700">Documentation fee</label>
                            <input type="number" id="documentationFee" value={documentationFee} onChange={(e) => setDocumentationFee(e.target.value)} className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="750" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <label htmlFor="otherFees" className="font-medium text-gray-700">Other fees</label>
                            <input type="number" id="otherFees" value={otherFees} onChange={(e) => setOtherFees(e.target.value)} className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="0" />
                        </div>
                        
                        <div className="flex items-center gap-4 pt-4">
                            <button onClick={handleReset} className="flex items-center justify-center w-full rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                                <RefreshCw className="w-5 h-5 mr-2" /> Reset
                            </button>
                            <button onClick={calculateLoan} className="flex items-center justify-center w-full rounded-md border border-transparent bg-[#1e204f] px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-opacity-90">
                                Calculate
                            </button>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="bg-gray-50 rounded-lg p-8 flex flex-col justify-center">
                        <h2 className="text-xl font-bold text-[#1e204f] flex items-center mb-6">
                            <BarChart2 className="w-6 h-6 mr-2" /> Results
                        </h2>
                        {isCalculated ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center"><span className="font-medium text-gray-600">Payback every {results.paymentFrequencyLabel}:</span><span className="font-bold text-lg text-gray-900">${results.paymentPerPeriod.toFixed(2)}</span></div>
                                <div className="flex justify-between items-center"><span className="font-medium text-gray-600">Total of payments:</span><span className="font-bold text-lg text-gray-900">${results.totalPayment.toFixed(2)}</span></div>
                                <div className="flex justify-between items-center"><span className="font-medium text-gray-600">Total Interest:</span><span className="font-bold text-lg text-blue-600">${results.totalInterest.toFixed(2)}</span></div>
                                <div className="flex justify-between items-center"><span className="font-medium text-gray-600">Interest + Fee:</span><span className="font-bold text-lg text-purple-600">${(results.totalInterest + results.totalFees).toFixed(2)}</span></div>
                                <div className="flex justify-between items-center"><span className="font-medium text-gray-600">Real Rate (APR):</span><span className="font-bold text-lg text-red-600">{results.apr.toFixed(3)}%</span></div>
                                <div className="mt-6 pt-4 border-t">
                                    <div className="flex w-full h-4 rounded-full overflow-hidden">
                                        <div className="bg-green-500" style={{ width: `${results.principalPercent}%` }} title={`Principal: ${results.principalPercent.toFixed(1)}%`}></div>
                                        <div className="bg-blue-500" style={{ width: `${results.interestPercent}%` }} title={`Interest: ${results.interestPercent.toFixed(1)}%`}></div>
                                        <div className="bg-purple-500" style={{ width: `${results.feePercent}%` }} title={`Fees: ${results.feePercent.toFixed(1)}%`}></div>
                                    </div>
                                     <div className="flex justify-between text-xs mt-2">
                                        <span className='text-green-500'>Principal</span>
                                        <span className='text-blue-500'>Interest</span>
                                        <span className='text-purple-500'>Fees</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500"><p>Enter your values and calculate to see results</p></div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mt-12">
                    <div className="prose prose-indigo max-w-none">
                        <h2 className="text-3xl font-bold text-[#1e204f]">Understanding Business Loans</h2>
                        <p>Business loans are designed to meet the financing needs of many different business types. They require the borrower to pay back both the principal and the interest, typically through monthly repayments.</p>
                        
                        <h3>Common Loan Types</h3>
                        <h4>SBA Loans</h4>
                        <p>Loans from the U.S. Small Business Administration (SBA) are government-guaranteed, which encourages lenders to offer favorable terms. They can be used for start-ups, acquisitions, working capital, and more, but often involve extra paperwork.</p>
                        <h4>Conventional Loans</h4>
                        <p>These loans come from banks or other financial institutions without a government guarantee. They might have a quicker approval process but often come with higher rates and shorter terms.</p>
                        
                        <h3>Understanding Loan Fees</h3>
                        <p>Business loans usually involve fees beyond just the interest. These can significantly impact the total cost of the loan.</p>
                        <ul>
                            <li><strong>Origination Fee:</strong> A fee for processing and approving the loan, typically 1-6% of the loan amount.</li>
                            <li><strong>Documentation Fee:</strong> A charge to cover the cost of processing paperwork.</li>
                            <li><strong>Other Fees:</strong> Can include monthly administrative fees, late payment penalties, or prepayment penalties.</li>
                        </ul>

                        <h3>The Bottom Line</h3>
                        <p>All these fees can make the actual cost of a loan higher than the stated interest rate. Our calculator accounts for these expenses to compute the loan's true APR, giving you a clear understanding of what you'll really pay.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mt-12">
                    <h2 className="text-3xl font-bold text-[#1e204f] mb-6">Business Loan Calculator: FAQs</h2>
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

export default BusinessLoanCalculatorPage; 