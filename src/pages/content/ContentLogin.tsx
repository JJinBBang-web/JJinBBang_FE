import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ContentLogin.module.css";
import home_logo from '../../assets/logo/homeLogo.svg';

const ContentLoginPage = () => {
  const navigate = useNavigate();
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  useEffect(() => {
      const handleResize = () => {
          setWindowHeight(window.visualViewport?.height || window.innerHeight);
      };

      window.addEventListener('resize', handleResize);
      
      // 초기 로드 시 한 번 실행
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = () => {
    if (id === "admin" && pw === "1234") {
      sessionStorage.setItem("isAdmin", "true");
      navigate("/admin/content");
    } else {
      alert("아이디 또는 비밀번호가 틀렸습니다");
    }
  };

  return (
    <div className={styles.content} style={{ minHeight: `${windowHeight}px`, display: "flex", flexDirection: "column" }}>
      <form className={styles.container}>
        <div className={styles.header}>
          <div className={styles.header_logo}>
            <img src={home_logo} alt="home_logo" />
          </div>
        </div>
        <h2 className={styles.title}>관리자 로그인</h2>
        <input className={styles.inputField} placeholder='아이디를 입력해주세요.' value={id} onChange={e => setId(e.target.value)} />
        <input className={styles.inputField} placeholder="비밀번호를 입력해주세요" type="password" value={pw} onChange={e => setPw(e.target.value)} />
        <button className={styles.confrimBtn} onClick={handleLogin}>로그인</button>
      </form>
    </div>
  );
};
export default ContentLoginPage;