import React from 'react';

export const ArtifactRenderer = ({ artifact }) => {
    if (!artifact) return null;

    switch (artifact.type) {
        case 'map':
            return (
                <div className="artifact-card map-artifact">
                    <div className="artifact-label">GEO-LOCATION NODE</div>
                    <div className="map-view">
                        <div className="map-grid"></div>
                        <div className="map-pin"></div>
                    </div>
                    <div className="artifact-meta">
                        <span>{artifact.label}</span>
                        <span>{artifact.lat}N, {artifact.lng}W</span>
                    </div>
                </div>
            );
        case 'blueprint':
            return (
                <div className="artifact-card blueprint-artifact">
                    <div className="artifact-label">CAPABILITY MATRIX // {artifact.code}</div>
                    <div className="blueprint-nodes">
                        {artifact.items.map((item, i) => (
                            <div key={i} className="blueprint-node">
                                <span className="node-dot"></span>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'stats':
            return (
                <div className="artifact-card stats-artifact">
                    <div className="artifact-label">SYSTEM METRICS</div>
                    {artifact.labels.map((label, i) => (
                        <div key={i} className="stat-row">
                            <div className="stat-header">
                                <span>{label}</span>
                                <span>{artifact.values[i]}%</span>
                            </div>
                            <div className="stat-bar">
                                <div className="stat-fill" style={{ width: `${artifact.values[i]}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        case 'tag':
            return (
                <div className="artifact-card tag-artifact">
                    <div className="tag-pill">
                        <span className="pill-key">{artifact.label}</span>
                        <span className="pill-val">{artifact.value}</span>
                    </div>
                </div>
            );
        case 'quote':
            return (
                <div className="artifact-card quote-artifact">
                    <div className="quote-text">"{artifact.text}"</div>
                    <div className="quote-source">// {artifact.source}</div>
                </div>
            );
        case 'contact':
            return (
                <div className="artifact-card contact-artifact">
                    <div className="contact-header">
                        <div className="artifact-label">COMMUNICATION NODE</div>
                        <div className="contact-status">
                            <span className="status-dot"></span>
                            {artifact.status}
                        </div>
                    </div>
                    <div className="contact-body">
                        <div className="contact-row">
                            <span className="contact-label">DIRECT FREQUENCY</span>
                            <a href={`mailto:${artifact.email}`} className="contact-value">{artifact.email}</a>
                        </div>
                        <div className="contact-row">
                            <span className="contact-label">SOCIAL FEED</span>
                            <span className="contact-value">{artifact.twitter}</span>
                        </div>
                    </div>
                </div>
            );
        default:
            return null;
    }
};
