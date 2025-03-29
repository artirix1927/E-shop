import "../../css/supporttickets.scss";
import { useEffect, useState } from "react";

export const TicketsSearch = ({ setFilterParams }) => {
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setFilterParams({ searchQuery, filter });
    }, [searchQuery, filter, setFilterParams]);

    return (
        <div className="filter-search-container">
            <input
                type="text"
                placeholder="Search by user or ticket ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
            />

            <div className="filter-buttons">
                {["all", "open", "closed"].map(type => (
                    <button
                        key={type}
                        className={`filter-btn ${filter === type ? "active" : ""}`}
                        onClick={() => setFilter(type)}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>
        </div>
    );
};