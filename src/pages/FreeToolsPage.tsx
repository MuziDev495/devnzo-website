/**
 * Free Tools Page Component
 * Displays helpful free calculator tools for business operations
 */

import { Calculator, BarChart3, Store, ExternalLink } from 'lucide-react';
import { renderBootstrapIcon } from '@/utils/iconRenderer';
import { Link } from 'react-router-dom';

interface Tool {
    icon: string;
    title: string;
    description: string;
    category: string;
    type: string;
    features: string[];
    url: string;
}

const FreeToolsPage = () => {
    const tools: Tool[] = [
        {
            icon: 'Calculator',
            title: 'ROI Calculator',
            description: 'Calculate the return on investment for your marketing campaigns and business initiatives.',
            category: 'Analytics',
            type: 'Web Tool',
            features: ['Campaign ROI', 'Business metrics', 'Profit analysis', 'Export reports'],
            url: '/tools/roi-calculator',
        },
        {
            icon: 'CashCoin',
            title: 'Business Loan Calculator',
            description: 'Estimate your monthly payments and total interest costs for any business loan.',
            category: 'Finance',
            type: 'Web Tool',
            features: ['Loan amortization', 'Interest calculation', 'Payment schedules', 'Export results'],
            url: '/tools/loan-calculator',
        },
        {
            icon: 'Shop',
            title: 'Shopify Fee Calculator: How Much Does A Shopify Store Cost?',
            description: 'Estimate the monthly costs of running your Shopify store, including subscription and transaction fees.',
            category: 'eCommerce',
            type: 'Web Tool',
            features: ['Subscription plans', 'Transaction fees', 'Payment gateway costs', 'Currency conversion'],
            url: '/tools/shopify-fee-calculator',
        },
        {
            icon: 'GraphUp',
            title: 'Profit Margin Calculator',
            description: 'Calculate your profit margin based on your sales and costs.',
            category: 'eCommerce',
            type: 'Web Tool',
            features: ['Profit margin', 'Costs', 'Sales', 'Export results'],
            url: '/tools/profit-margin-calculator',
        },
    ];

    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'analytics':
                return 'bg-green-100 text-green-700';
            case 'finance':
                return 'bg-blue-100 text-blue-700';
            case 'ecommerce':
                return 'bg-purple-100 text-purple-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-gradient-hero py-20 text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
                        Free Tools
                    </h1>
                    <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
                        Helpful free calculators and tools to boost your business operations and make smarter decisions.
                    </p>
                </div>
            </section>

            {/* Tools Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tools.map((tool, index) => (
                            <div
                                key={index}
                                className="bg-card rounded-2xl p-8 shadow-md border border-border hover:shadow-xl transition-all duration-300 flex flex-col"
                            >
                                {/* Header with icon and tags */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        {renderBootstrapIcon(tool.icon, '', 28)}
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(tool.category)}`}>
                                            {tool.category}
                                        </span>
                                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                                            {tool.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Title and Description */}
                                <h3 className="text-xl font-semibold text-foreground mb-2">{tool.title}</h3>
                                <p className="text-muted-foreground mb-4 text-sm">{tool.description}</p>

                                {/* Features */}
                                <div className="mb-6 flex-grow">
                                    <h4 className="text-sm font-semibold text-foreground mb-2">Features:</h4>
                                    <ul className="space-y-1">
                                        {tool.features.map((feature, i) => (
                                            <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* CTA Button */}
                                <Link
                                    to={tool.url}
                                    className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Use Tool
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FreeToolsPage;
