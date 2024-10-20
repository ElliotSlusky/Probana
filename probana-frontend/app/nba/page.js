"use client";

import React, { useState } from "react";
import { getMomentIDs } from "../../app/components/getNFTs";
import styles from "./MomentChecker.module.css";
import { Spinner } from "../../app/components/Spinner"; // Añadir un spinner para feedback visual mientras se cargan datos

function MomentChecker() {
    const [address, setAddress] = useState("");
    const [hasMoments, setHasMoments] = useState(null);
    const [moments, setMoments] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hoveredMoment, setHoveredMoment] = useState(null);

    const handleCheckMoments = async () => {
        if (address.trim() === "") {
            setError("Please enter a valid address");
            return;
        }

        setLoading(true);
        const result = await getMomentIDs(address);
        setLoading(false);

        if (result.error) {
            setError("Error retrieving moments and metadata.");
            setHasMoments(false);
        } else {
            setHasMoments(result.hasMoments);
            setMoments(result.momentsWithMetadata);
            setError(false);
        }
    };

    const handleMouseEnter = (moment) => {
        setHoveredMoment(moment.id);
    };

    const handleMouseLeave = () => {
        setHoveredMoment(null);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>NBA Top Shot Moment Checker</h1>
                <p className={styles.subtitle}>Enter your wallet address to check your Moments collection</p>
            </header>

            <div className={styles.inputContainer}>
                <input
                    className={styles.input}
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter account address"
                />
                <button
                    className={styles.button}
                    onClick={handleCheckMoments}
                    disabled={loading || !address.trim()}
                >
                    {loading ? <Spinner /> : "Check Moments"} {/* Muestra un spinner durante la carga */}
                </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            {hasMoments === null ? null : hasMoments ? (
                <div className={styles.momentsList}>
                    <h2>Your NBA Top Shot Moments</h2>
                    <ul className={styles.momentsGrid}>
                        {moments.map((moment) => (
                            <li key={moment.id} className={styles.momentCard}>
                                <div 
                                    className={styles.thumbnailWrapper}
                                    onMouseEnter={() => handleMouseEnter(moment)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {hoveredMoment === moment.id ? (
                                        <video
                                            className={styles.videoThumbnail}
                                            autoPlay
                                            muted
                                            loop
                                        >
                                            <source src={moment.metadata.videoURL} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <img
                                            src={moment.metadata.thumbnail}
                                            alt={`${moment.metadata.name} thumbnail`}
                                            className={styles.thumbnail}
                                        />
                                    )}
                                </div>
                                <div className={styles.momentDetails}>
                                    <p><strong>Moment ID:</strong> {moment.id}</p>
                                    <p><strong>Name:</strong> {moment.metadata.name}</p>
                                    <p><strong>Description:</strong> {moment.metadata.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No moments found for this account.</p>
            )}
        </div>
    );
}

export default MomentChecker;
