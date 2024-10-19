"use client";

import { GateFiDisplayModeEnum, GateFiSDK } from '@gatefi/js-sdk';
import { useRef, useEffect, useState } from 'react';
import crypto from 'crypto';

const UnlimitOverlay = () => {
    // References for the SDK instances
    const overlayInstanceSDK = useRef(null);

    // State to manage overlay visibility
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);

    // Cleanup when the component is unmounted
    useEffect(() => {
        return () => {
            overlayInstanceSDK.current?.destroy();
            overlayInstanceSDK.current = null;
        };
    }, []);

    // Function to handle clicks on the "Overlay" button
    const handleOnClick = () => {
        if (overlayInstanceSDK.current) {
            if (isOverlayVisible) {
                overlayInstanceSDK.current.hide();
                setIsOverlayVisible(false);
            } else {
                overlayInstanceSDK.current.show();
                setIsOverlayVisible(true);
            }
        } else {
            const randomString = crypto.randomBytes(32).toString('hex');
            overlayInstanceSDK.current = new GateFiSDK({
                merchantId: "9e34f479-b43a-4372-8bdf-90689e16cd5b",
                displayMode: GateFiDisplayModeEnum.Overlay,
                nodeSelector: "#overlay-button",
                isSandbox: true,
                walletAddress: "0xb43Ae6CC2060e31790d5A7FDAAea828681a9bB4B",
                email: "test@tester.com",
                externalId: randomString,
                defaultFiat: {
                    currency: "USD",
                    amount: "64",
                },
                defaultCrypto: {
                    currency: "ETH"
                },
            });
            overlayInstanceSDK.current?.show();
            setIsOverlayVisible(true);
        }
    };

    // Component render
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
            <h2>Unlimit Crypto - Overlay SDK Example</h2>
            <button onClick={handleOnClick} style={{ padding: '10px 20px', margin: '20px', fontSize: '16px' }}>
                {isOverlayVisible ? 'Hide Overlay SDK' : 'Show Overlay SDK'}
            </button>
            {/* Container for the overlay button */}
            <div id="overlay-button"></div>
        </div>
    );
};

export default UnlimitOverlay;
