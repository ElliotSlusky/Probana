//app/nba/page.js
"use client";  // Marks this file as a Client Component

import React, { useState } from "react";
import { getMomentIDs } from "../../app/components/getNFTs";

function MomentChecker() {
    const [address, setAddress] = useState("");
    const [hasMoments, setHasMoments] = useState(null);
    const [moments, setMoments] = useState([]);
    const [error, setError] = useState(false);
    const [selectedMoment, setSelectedMoment] = useState(null);

    const handleCheckMoments = async () => {
        const result = await getMomentIDs(address);
        
        console.log("Retrieved moments and metadata: ", result);  // Log the moments and metadata for debugging
        
        if (result.error) {
            setError(true);
            setHasMoments(false);
        } else {
            setHasMoments(result.hasMoments);
            setMoments(result.momentsWithMetadata);
            setError(false);
        }
    };

    const handleThumbnailClick = (moment) => {
        setSelectedMoment(moment);
    };

    const handleCloseVideo = () => {
        setSelectedMoment(null);
    };

    return (
        <div>
            <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter account address"
            />
            <button onClick={handleCheckMoments}>Check Moments</button>

            {error && <p>Error retrieving moments and metadata.</p>}

            {hasMoments === null ? null : hasMoments ? (
                <div>
                    <p>The account has the following moments:</p>
                    <ul>
                        {moments.map((moment) => (
                            <li key={moment.id}>
                                <p><strong>Moment ID:</strong> {moment.id}</p>
                                <p><strong>Metadata:</strong></p>
                                {moment.metadata ? (
                                    <div style={{ marginBottom: "20px" }}>
                                        <img 
                                            src={moment.metadata.thumbnail} 
                                            alt={`${moment.metadata.name} thumbnail`} 
                                            style={{ width: "150px", height: "auto", cursor: "pointer" }}
                                            onClick={() => handleThumbnailClick(moment)}
                                        />
                                        <p><strong>Name:</strong> {moment.metadata.name}</p>
                                        <p><strong>Description:</strong> {moment.metadata.description}</p>
                                    </div>
                                ) : (
                                    <p>No metadata available</p>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>The account has no moments.</p>
            )}

            {selectedMoment && (
                <div className="video-modal" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ position: "relative", width: "80%", maxWidth: "800px" }}>
                        <button onClick={handleCloseVideo} style={{ position: "absolute", top: "10px", right: "10px", background: "white", border: "none", cursor: "pointer" }}>Close</button>
                        <video controls style={{ width: "100%" }}>
                            <source src={selectedMoment.metadata.videoURL} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MomentChecker;
