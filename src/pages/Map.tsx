import React, { useEffect, useState, useMemo } from 'react';
import '../styles/global.css'
import HousingFilter from '../components/map/HousingFilter';
import SearchBar from '../components/map/SearchBar';
import styles from "./Map.module.css";

const Map = () => {

    return (
        <div className="content">
            <div className={styles.header_bar}>
                <HousingFilter/>
                <SearchBar/>
            </div>
        </div>
    )
}

export default Map;