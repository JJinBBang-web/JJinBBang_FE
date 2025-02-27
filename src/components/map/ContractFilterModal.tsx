import styles from "./ContentFilterModal.module.css"

const ContractFilterModal = () => {
    return (
        <div className={styles.content}>
            {/* 계약형태 */}
            <div className={styles.contract_wrap}>
                <button className={styles.contract_btn}>전체</button>
                <button className={styles.contract_btn}>월세</button>
                <button className={styles.contract_btn}>전세</button>
            </div>
            <div className={styles.divider}></div>
            {/* 계약조건 */}
            <div className={styles.condition_wrap}>
                <div className={styles.condition_header}>
                    <p>조건</p>
                    <label className={styles.checkbox_wrap}>
                        <input type="checkbox"/>
                        <span className={styles.checkmark}></span>
                        관리비 포함
                    </label>
                </div>
                <div className={styles.condition_content}>
                    <div className={styles.content_wrap}>
                        <p>보증금(전세금)</p>
                        <p>전체</p>
                    </div>
                    <div className={styles.content_range}>
                        <input type="range"></input>
                        <input type="range"></input>
                    </div>
                    <div className={styles.content_info}>
                    <div className={styles.range}>
                            <hr/>
                            <hr/>
                        </div>
                        <div className={styles.range}>
                            <hr/>
                            <hr/>
                        </div>
                        <div className={styles.range_text}>
                            <p>0만원</p>
                            <p>5000만원 이상</p>
                        </div>
                    </div>
                </div>
                <hr className={styles.divider2}/>
                <div className={styles.condition_content}>
                    <div className={styles.content_wrap}>
                        <p>월세</p>
                        <p>전체</p>
                    </div>
                    <div className={styles.content_range}>
                        <input type="range"></input>
                        <input type="range"></input>
                    </div>
                    <div className={styles.content_info}>
                        <div className={styles.range}>
                            <hr/>
                            <hr/>
                        </div>
                        <div className={styles.range}>
                            <hr/>
                            <hr/>
                        </div>
                        <div className={styles.range_text}>
                            <p>0만원</p>
                            <p>500만원 이상</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.btn_content}>
                <button className={`${styles.reset_btn}`} 
                // onClick={() => setSelectedType("전체")}
                >초기화</button>
                <button className={`${styles.confirm_btn}`} 
                // onClick={() => {
                //         if (isConfirmActive) {
                //             setHousingType(selectedType);
                //             setBottomSheet({ isOpen: false, type: null }); 
                //         }
                //     }}
                    >확인</button>
            </div>
        </div>
    )
}

export default ContractFilterModal;