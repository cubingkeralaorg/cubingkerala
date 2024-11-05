import ContactComponent from '@/components/contact';
import { Metadata } from 'next';
import React from 'react'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: "Contact | Cubing Kerala",
    description: "Contact Cubing Kerala",
};

const Contact = () => {
    return (
        <>
            <ContactComponent />
        </>

    )
}

export default Contact