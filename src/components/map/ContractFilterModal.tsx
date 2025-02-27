import { useRecoilState } from "recoil";
import styles from "./ContentFilterModal.module.css"
import { monthlyRentRangeState, securityRangeState } from "../../recoil/map/mapRecoilState";
import { useCallback, useEffect } from "react";
import Slider from "react-slider";


const ContractFilterModal = () => {
    const [securityRange, setSecurityRange] = useRecoilState(securityRangeState);
    const [monthlyRentRange, setMonthlyRentRange] = useRecoilState(monthlyRentRangeState);

    // 보증금 값 조정
    const formatSecurityValue = useCallback((value: number) => {
        return value === 5000 ? value : value * 100;
    }, []);
    // 월세 값 조정
    const formatMonthlyRentValue = useCallback((value: number) => {
        return value === 500 ? value : value <= 40 ? value * 5 : 200 + (value-40) * 10;
    }, []);
    
    return (
        <div className={styles.content}>
            {/* 계약형태 */}
            <div className={styles.contract_wrap}>
                <button className={`${styles.contract_btn} ${styles.selected_btn}`}>전체</button>
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
                        <p>{formatSecurityValue(securityRange[1])}만원 이하</p>
                    </div>
                    <div className={styles.content_range}>
                        <Slider className={styles.slider}
                            min={0}
                            max={50}
                            step={1}
                            value={securityRange}
                            onChange={setSecurityRange}
                            renderTrack={(props, state) => (
                                <div {...props} className={
                                    state.index === 0 || state.index === 2
                                    ? styles.track 
                                    : styles.trackSelected
                                } />
                            )}
                            renderThumb={(props) => <div {...props} className={styles.thumb} />}
                        />
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
                        <p>{formatMonthlyRentValue(monthlyRentRange[1])}만원 이하</p>
                    </div>
                    <div className={styles.content_range}>
                        <Slider className={styles.slider}
                            min={0}
                            max={70}
                            step={1}
                            value={monthlyRentRange}
                            onChange={setMonthlyRentRange}
                            renderTrack={(props, state) => (
                                <div {...props} className={
                                    state.index === 0 || state.index === 2
                                    ? styles.track 
                                    : styles.trackSelected
                                } />
                            )}
                            renderThumb={(props) => <div {...props} className={styles.thumb} />}
                        />
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