import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ContentLoginPage = () => {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleLogin = () => {
    if (id === "admin" && pw === "1234") {
      sessionStorage.setItem("isAdmin", "true");
      navigate("/admin/content");
    } else {
      alert("아이디 또는 비밀번호가 틀렸습니다");
    }
  };

  return (
    <div>
      <input value={id} onChange={e => setId(e.target.value)} />
      <input type="password" value={pw} onChange={e => setPw(e.target.value)} />
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
};
export default ContentLoginPage;