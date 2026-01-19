/**
 * Icon Renderer Utility
 * Renders Bootstrap Icons from string names stored in CMS
 */

import React from 'react';
import * as BootstrapIcons from 'react-bootstrap-icons';

/**
 * Render a Bootstrap Icon by name
 * @param iconName - The Bootstrap Icon name (e.g., 'BarChartLine', 'Gear')
 * @param className - Optional CSS class for styling
 * @param size - Optional icon size (default: 24)
 * @returns React element or null if icon not found
 */
export const renderBootstrapIcon = (
    iconName: string,
    className?: string,
    size: number = 24
): React.ReactElement | null => {
    // Handle empty or undefined icon names
    if (!iconName) return null;

    // Check if it's an emoji (starts with non-ASCII character)
    // This provides backward compatibility with existing emoji icons
    if (/[^\u0000-\u007F]/.test(iconName.charAt(0))) {
        return <span className={className} style={{ fontSize: size }}>{iconName}</span>;
    }

    // Get the icon component from react-bootstrap-icons
    const IconComponent = (BootstrapIcons as any)[iconName];

    if (!IconComponent) {
        // Fallback: return the icon name as text if component not found
        console.warn(`Bootstrap Icon "${iconName}" not found`);
        return <span className={className}>{iconName}</span>;
    }

    return <IconComponent className={className} size={size} />;
};

/**
 * Check if an icon name is a valid Bootstrap Icon
 */
export const isValidBootstrapIcon = (iconName: string): boolean => {
    if (!iconName) return false;
    return typeof (BootstrapIcons as any)[iconName] === 'function';
};

/**
 * Get a list of all available Bootstrap Icon names
 */
export const getAllBootstrapIconNames = (): string[] => {
    return Object.keys(BootstrapIcons).filter(
        (key) => typeof (BootstrapIcons as any)[key] === 'function' && key !== 'default'
    );
};

export default renderBootstrapIcon;
