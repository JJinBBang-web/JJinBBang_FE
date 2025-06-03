import React, { useEffect, useState, useMemo } from 'react';
import '../styles/global.css'
import HousingFilter from '../components/map/HousingFilter';
import SearchBar from '../components/map/SearchBar';
import styles from "./Map.module.css";
import FilterBar from '../components/map/FilterBar';
import ReviewListHeader from '../components/map/ReviewListHeader';
import Modal from '../components/review/Modal';
import iconClose from "../assets/image/iconClose.svg"


const Map = () => {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSheetVisible, setIsSheetVisible] = useState(true);

    const handleOpenModal = () => {
        setIsSheetVisible(false);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsSheetVisible(true);
    };


    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.visualViewport?.height || window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        
        // 초기 로드 시 한 번 실행
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={styles.content}             
            style={{ minHeight: `${windowHeight}px`, display: "flex", flexDirection: "column" }}>
            <div className={`${styles.container} ${styles.header_bar}`}>
                <HousingFilter/>
                <SearchBar/>
            </div>
            <FilterBar/>
            {isSheetVisible && <ReviewListHeader onOpenModal={handleOpenModal} />}
            {isModalOpen && <Modal onClose={handleCloseModal} style={{zIndex: 888}}>
                    <div className={styles.wrap}>
                        <div className={styles.sheet_header}>
                            <div className={styles.header_divider}></div>
                        </div>
                        <div className={styles.sheet_title_wrap}>
                            <div className={styles.sheet_info_wrap}>
                                <p className={styles.sheet_title}>내 주변 찐빵 (<span>25</span>)</p>
                            </div>
                            <img src={iconClose} width="24px" onClick={handleCloseModal}/>
                        </div>
                    </div>
                </Modal>
            }
        </div>
    )
}

export default Map;