/**
 * Icon Picker Component
 * Searchable dropdown for Bootstrap Icons selection in Content Manager
 */

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, Search } from 'lucide-react';
import * as BootstrapIcons from 'react-bootstrap-icons';

// Popular Bootstrap Icons for common use cases
const POPULAR_ICONS = [
    // Business & Analytics
    'BarChartLine', 'GraphUp', 'GraphUpArrow', 'PieChart', 'Activity',
    // Commerce
    'Cart', 'CartCheck', 'Shop', 'Bag', 'CreditCard', 'Wallet', 'CurrencyDollar',
    // Communication
    'Chat', 'ChatDots', 'Envelope', 'Telephone', 'Megaphone', 'Bell',
    // People & Users
    'Person', 'People', 'PersonCircle', 'PersonCheck', 'PersonPlus',
    // Tech & Settings
    'Gear', 'GearFill', 'Tools', 'Wrench', 'Cpu', 'CodeSlash', 'Terminal',
    // Navigation & UI
    'House', 'Search', 'ArrowRight', 'ArrowUp', 'Check', 'CheckCircle', 'X',
    // Content & Media
    'FileText', 'Folder', 'Image', 'Camera', 'Play', 'Film',
    // Social
    'Globe', 'Share', 'Heart', 'Star', 'StarFill', 'Award',
    // Actions
    'Lightning', 'LightningCharge', 'Rocket', 'Send', 'Download', 'Upload',
    // Security
    'Shield', 'ShieldCheck', 'Lock', 'Key',
    // Time
    'Clock', 'Calendar', 'Alarm',
    // Other
    'Box', 'Gift', 'Truck', 'Headset', 'QuestionCircle', 'InfoCircle',
];

// Get all Bootstrap Icon names (filter out non-component exports)
const ALL_ICON_NAMES = Object.keys(BootstrapIcons).filter(
    (key) => typeof (BootstrapIcons as any)[key] === 'function' && key !== 'default'
);

interface IconPickerProps {
    value: string;
    onChange: (iconName: string) => void;
    placeholder?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({
    value,
    onChange,
    placeholder = 'Select icon...',
}) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [showAll, setShowAll] = useState(false);

    // Filter icons based on search
    const filteredIcons = useMemo(() => {
        const iconList = showAll ? ALL_ICON_NAMES : POPULAR_ICONS;
        if (!search) return iconList;
        return iconList.filter((name) =>
            name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, showAll]);

    // Render icon component by name
    const renderIcon = (iconName: string, size = 20) => {
        const IconComponent = (BootstrapIcons as any)[iconName];
        if (!IconComponent) return null;
        return <IconComponent size={size} />;
    };

    // Selected icon display
    const selectedIcon = value ? renderIcon(value, 18) : null;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-10"
                >
                    <div className="flex items-center gap-2">
                        {selectedIcon}
                        <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
                            {value || placeholder}
                        </span>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
                <div className="p-3 border-b">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search icons..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <Button
                            variant={showAll ? 'outline' : 'default'}
                            size="sm"
                            onClick={() => setShowAll(false)}
                        >
                            Popular
                        </Button>
                        <Button
                            variant={showAll ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setShowAll(true)}
                        >
                            All Icons ({ALL_ICON_NAMES.length})
                        </Button>
                    </div>
                </div>
                <ScrollArea className="h-64">
                    <div className="grid grid-cols-5 gap-1 p-2">
                        {filteredIcons.map((iconName) => (
                            <button
                                key={iconName}
                                onClick={() => {
                                    onChange(iconName);
                                    setOpen(false);
                                    setSearch('');
                                }}
                                className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-accent transition-colors ${value === iconName ? 'bg-primary/10 ring-1 ring-primary' : ''
                                    }`}
                                title={iconName}
                            >
                                {renderIcon(iconName, 22)}
                            </button>
                        ))}
                    </div>
                    {filteredIcons.length === 0 && (
                        <div className="flex items-center justify-center h-32 text-muted-foreground">
                            No icons found
                        </div>
                    )}
                </ScrollArea>
                {value && (
                    <div className="p-2 border-t bg-muted/50">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Selected:</span>
                            {selectedIcon}
                            <span className="font-mono text-xs">{value}</span>
                        </div>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
};

export default IconPicker;
