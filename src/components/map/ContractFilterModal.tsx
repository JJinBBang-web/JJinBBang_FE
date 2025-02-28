import { useRecoilState, useRecoilValue } from "recoil";
import styles from "./ContractFilterModal.module.css"
import { monthlyRentRangeState, depositRangeState, selectedTypeState, selectedContractState, filterState } from "../../recoil/map/mapRecoilState";
import { useCallback, useEffect } from "react";
import Slider from "react-slider";

const contractType = [
    {text : "전체", type : "ALL"},
    {text : "월세", type : "MONTHLY_RENT"},
    {text : "전세", type : "DEPOSIT_RENT"},
]

const ContractFilterModal = (isOpen: unknown) => {
    const [depositRange, setDepositRange] = useRecoilState(depositRangeState);
    const [monthlyRentRange, setMonthlyRentRange] = useRecoilState(monthlyRentRangeState);
    const [selectedContract, setSelectedContract] = useRecoilState(selectedContractState);

    const [filter, ] = useRecoilState(filterState);

    // 보증금 값 조정
    const formatDepositValue = useCallback((value: number) => {
        return value === 5000 ? value : value * 100;
    }, []);
    // 월세 값 조정
    const formatMonthlyRentValue = useCallback((value: number) => {
        return value === 500 ? value : value <= 40 ? value * 5 : 200 + (value-40) * 10;
    }, []);

    const isDepositRangeDefault = depositRange[0] === 0 && depositRange[1] === 5000;
    const isMonthlyRentRangeDefault = monthlyRentRange[0] === 0 && monthlyRentRange[1] === 500;

    // 변수 설정
    const contract = filter.contractType;
    const depositMin = filter.depositMin;
    const depositMax = filter.depositMax;
    const monthlyRentMin = filter.monthlyRentMin;
    const monthlyRentMax = filter.monthlyRentMax;
    const inMaintenanceCost = filter.inMaintenanceCost;

    // 확인 & 초기화 버튼 활성화
    const isConfirmActive = selectedContract !== contract;
    const isResetActive = selectedContract !== "ALL";


    return (
        <div className={styles.content}>
            {/* 계약형태 */}
            <div className={styles.contract_wrap}>
                {contractType.map((con) => 
                    <button key={con.type} className={`${styles.contract_btn} ${ selectedContract === con.type ? styles.selected_btn : ""}`}
                    onClick={()=> {
                        setSelectedContract(con.type);
                    }}
                    >{con.text}</button>
                )}
            </div>
            <div className={styles.divider}></div>
            {/* 계약조건 */}
            <div className={styles.condition_wrap}>
                <div className={styles.condition_header}>
                    <p>조건</p>
                    <label className={styles.checkbox_wrap}>
                        <input type="checkbox"/>
                        <span className={styles.checkmark}></span>
                        관리비<span className={styles.text_nbsp}>포함</span>
                    </label>
                </div>
                <div className={styles.condition_content}>
                    <div className={styles.content_wrap}>
                        <p>보증금(전세금)</p>
                        {
                            isDepositRangeDefault
                            ? <p>전체</p>
                            : <p>{formatDepositValue(depositRange[0])}만원<span>~</span>{formatDepositValue(depositRange[1])}만원</p>
                        }
                    </div>
                    <div className={styles.content_range}>
                        <Slider className={styles.slider}
                            min={0}
                            max={50}
                            step={1}
                            value={depositRange}
                            onChange={setDepositRange}
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
                            <p>5000만원<span className={styles.text_nbsp}>이상</span></p>
                        </div>
                    </div>
                </div>
                <hr className={styles.divider2}/>
                <div className={styles.condition_content}>
                    <div className={styles.content_wrap}>
                        <p>월세</p>
                        {
                            isMonthlyRentRangeDefault
                            ? <p>전체</p>
                            : <p>{formatMonthlyRentValue(monthlyRentRange[0])}만원<span>~</span>{formatMonthlyRentValue(monthlyRentRange[1])}만원</p>
                        }
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
                            <p>500만원<span className={styles.text_nbsp}>이상</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.btn_content}>
                <button className={`${styles.reset_btn} ${isResetActive ? styles.reset_btn_active : ""}`} 
                onClick={() => setSelectedContract("ALL")}
                >초기화</button>
                <button className={`${styles.confirm_btn} ${isConfirmActive ? styles.confirm_btn_active : ""}`} 
                onClick={() => {
                        if (isConfirmActive) {
                        }
                    }}
                    >확인</button>
            </div>
        </div>
    )
}

export default ContractFilterModal;