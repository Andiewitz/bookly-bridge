'use client';

import React from 'react';
import { Button } from './Base';
import { MessageCircle, Instagram, Mail, ExternalLink } from 'lucide-react';

interface ContactButtonProps {
    method: 'whatsapp' | 'instagram' | 'email';
    value: string;
    className?: string;
}

export const ContactButton = ({ method, value, className }: ContactButtonProps) => {
    const getLink = () => {
        switch (method) {
            case 'whatsapp':
                // Remove non-numeric characters for WhatsApp
                const phone = value.replace(/\D/g, '');
                return `https://wa.me/${phone}`;
            case 'instagram':
                const handle = value.replace('@', '');
                return `https://instagram.com/${handle}`;
            case 'email':
                return `mailto:${value}`;
            default:
                return '#';
        }
    };

    const getIcon = () => {
        switch (method) {
            case 'whatsapp': return <MessageCircle size={18} />;
            case 'instagram': return <Instagram size={18} />;
            case 'email': return <Mail size={18} />;
        }
    };

    return (
        <a href={getLink()} target="_blank" rel="noopener noreferrer" className="block w-full">
            <Button className={className}>
                {getIcon()}
                Contact on {method.charAt(0).toUpperCase() + method.slice(1)}
                <ExternalLink size={14} className="ml-auto opacity-50" />
            </Button>
        </a>
    );
};
