import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Hospital,
  User,
  CalendarCheck,
  Check,
  Printer,
  RefreshCw,
  LogOut,
  ChevronDown,
  Database,
} from "lucide-react";

const API = "http://localhost:3001/api";

/* ─── Types ─── */
interface Option {
  value: string;
  label: string;
}

/* ─── Taiwan ID Validation ─── */
// Format: 1 English letter + 9 digits (e.g. A123456789)
function validateTaiwanId(id: string): { valid: boolean; message: string } {
  if (!id) return { valid: true, message: "" };

  const upper = id.toUpperCase();

  if (upper.length > 10) {
    return { valid: false, message: "身分證字號最多 10 碼" };
  }

  // Check first char is English
  if (!/^[A-Z]/.test(upper)) {
    return { valid: false, message: "第一碼必須為英文字母" };
  }

  // Check remaining chars are digits
  if (upper.length > 1 && !/^[A-Z]\d*$/.test(upper)) {
    return { valid: false, message: "第二碼起必須為數字" };
  }

  if (upper.length > 0 && upper.length < 10) {
    return { valid: false, message: `還需輸入 ${10 - upper.length} 碼` };
  }

  // Full 10-char checksum validation
  if (upper.length === 10) {
    const letterMap: Record<string, number> = {
      A:10,B:11,C:12,D:13,E:14,F:15,G:16,H:17,I:34,J:18,
      K:19,L:20,M:21,N:22,O:35,P:23,Q:24,R:25,S:26,T:27,
      U:28,V:29,W:32,X:30,Y:31,Z:33,
    };
    const n = letterMap[upper[0]];
    if (!n) return { valid: false, message: "無效的英文字母" };

    const n1 = Math.floor(n / 10);
    const n2 = n % 10;
    const digits = upper.slice(1).split("").map(Number);
    const weights = [8, 7, 6, 5, 4, 3, 2, 1];
    let sum = n1 + n2 * 9;
    for (let i = 0; i < 8; i++) {
      sum += digits[i] * weights[i];
    }
    sum += digits[8];

    if (sum % 10 !== 0) {
      return { valid: false, message: "身分證字號檢查碼錯誤" };
    }
  }

  return { valid: true, message: "" };
}

/* ─── Form Input ─── */
function FormInput({
  label,
  placeholder,
  width,
  value,
  onChange,
  error,
  maxLength,
}: {
  label: string;
  placeholder?: string;
  width?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  maxLength?: number;
}) {
  return (
    <div className="flex flex-col gap-1" style={width ? { width, flexShrink: 0 } : { flex: 1 }}>
      <label className="text-xs font-medium" style={{ color: "#333" }}>
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        style={{
          height: 36,
          border: `1px solid ${error ? "#A62911" : "#9DA4B3"}`,
          backgroundColor: error ? "#FFF5F5" : "#fff",
          padding: "6px 12px",
          fontSize: 13,
          color: "#333",
          outline: "none",
        }}
      />
      {error && (
        <span style={{ fontSize: 11, color: "#A62911", marginTop: 1 }}>{error}</span>
      )}
    </div>
  );
}

/* ─── Form Select ─── */
function FormSelect({
  label,
  placeholder = "請選擇",
  width,
  options = [],
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  width?: string;
  options?: Option[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5" style={width ? { width, flexShrink: 0 } : { flex: 1 }}>
      <label className="text-xs font-medium" style={{ color: "#333" }}>
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            height: 36,
            width: "100%",
            appearance: "none",
            border: "1px solid #9DA4B3",
            backgroundColor: "#fff",
            padding: "6px 36px 6px 12px",
            fontSize: 13,
            color: value ? "#333" : "#5B5F66",
            outline: "none",
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 -translate-y-1/2"
          style={{ right: 12, width: 16, height: 16, color: "#5B5F66" }}
        />
      </div>
    </div>
  );
}

/* ─── Form Date Input ─── */
function FormDateInput({
  label,
  width,
  value,
  onChange,
}: {
  label: string;
  width?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1" style={width ? { width, flexShrink: 0 } : { flex: 1 }}>
      <label className="text-xs font-medium" style={{ color: "#333" }}>
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          height: 36,
          border: "1px solid #9DA4B3",
          backgroundColor: "#fff",
          padding: "6px 12px",
          fontSize: 13,
          color: value ? "#333" : "#5B5F66",
          outline: "none",
        }}
      />
    </div>
  );
}

/* ─── Divider ─── */
function Divider() {
  return <div style={{ height: 1, width: "100%", backgroundColor: "#F0EFEC" }} />;
}

/* ─── Action Button ─── */
function ActionButton({
  icon,
  label,
  gradient,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  gradient: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 cursor-pointer"
      style={{
        background: gradient,
        borderRadius: 10,
        padding: "10px 20px",
        border: "none",
        boxShadow: "0 2px 20px #00000015",
      }}
    >
      {icon}
      <span className="text-[13px] font-semibold text-white">{label}</span>
    </button>
  );
}

/* ─── RegistrationPage ─── */
function RegistrationPage() {
  // Form state
  const [medicalNo, setMedicalNo] = useState("");
  const [patientName, setPatientName] = useState("");
  const [gender, setGender] = useState("");
  const [visitType, setVisitType] = useState("");
  const [birthday, setBirthday] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [cityName, setCityName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [address, setAddress] = useState("");
  const [regDate, setRegDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [regPeriod, setRegPeriod] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [regNumber, setRegNumber] = useState("--");
  const [regDeptName, setRegDeptName] = useState("");
  const [medicalNoTouched, setMedicalNoTouched] = useState(false);
  const skipCityEffectRef = useRef(false);

  // Validate medical number (Taiwan ID)
  const idValidation = validateTaiwanId(medicalNo);
  const medicalNoError = medicalNoTouched && medicalNo ? idValidation.message : "";

  // Dropdown options from backend
  const [cities, setCities] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);
  const [departments, setDepartments] = useState<Option[]>([]);
  const [doctors, setDoctors] = useState<Option[]>([]);

  // Load cities & departments on mount
  useEffect(() => {
    axios.get(`${API}/cities`).then((res) => {
      setCities(res.data.map((c: { name: string }) => ({ value: c.name, label: c.name })));
    });
    axios.get(`${API}/departments`).then((res) => {
      setDepartments(res.data.map((d: { code: string; name: string }) => ({ value: d.code, label: d.name })));
    });
  }, []);

  // Clear patient fields helper
  const clearPatientFields = () => {
    setPatientName("");
    setGender("");
    setVisitType("");
    setBirthday("");
    setAge("");
    setPhone("");
    setCityName("");
    setDistrictName("");
    setDistricts([]);
    setAddress("");
  };

  // When medicalNo changes → validate and auto-lookup or clear
  useEffect(() => {
    if (!medicalNo || medicalNo.length < 10) {
      if (medicalNo.length > 0) clearPatientFields();
      return;
    }
    if (!validateTaiwanId(medicalNo).valid) {
      clearPatientFields();
      return;
    }
    axios.get(`${API}/patients`, { params: { medical_no: medicalNo } }).then((res) => {
      const p = res.data;
      if (!p) {
        clearPatientFields();
        setVisitType("first");
        return;
      }
      setPatientName(p.name || "");
      setGender(p.gender || "");
      setBirthday(p.birthday ? p.birthday.replaceAll("/", "-") : "");
      setAge(p.age ? String(p.age) : "");
      setPhone(p.phone || "");
      // Skip city effect to prevent it from clearing districtName
      skipCityEffectRef.current = true;
      setCityName(p.city_name || "");
      if (p.city_name) {
        axios.get(`${API}/cities/${encodeURIComponent(p.city_name)}/districts`).then((dRes) => {
          setDistricts(dRes.data.map((d: { name: string }) => ({ value: d.name, label: d.name })));
          setDistrictName(p.district_name || "");
        });
      } else {
        setDistricts([]);
        setDistrictName("");
      }
      setAddress(p.address || "");
      setVisitType("return"); // auto set to 複診
    });
  }, [medicalNo]);

  // Auto-calc age from birthday
  useEffect(() => {
    if (!birthday) { setAge(""); return; }
    const birth = new Date(birthday);
    if (isNaN(birth.getTime())) return;
    const today = new Date();
    let a = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
    setAge(a >= 0 ? String(a) : "");
  }, [birthday]);

  // When city changes → fetch districts
  useEffect(() => {
    if (skipCityEffectRef.current) {
      skipCityEffectRef.current = false;
      return;
    }
    setDistrictName("");
    if (!cityName) {
      setDistricts([]);
      return;
    }
    axios.get(`${API}/cities/${encodeURIComponent(cityName)}/districts`).then((res) => {
      setDistricts(res.data.map((d: { name: string }) => ({ value: d.name, label: d.name })));
    });
  }, [cityName]);

  // When department changes → fetch doctors
  useEffect(() => {
    setDoctorName("");
    if (!departmentCode) {
      setDoctors([]);
      return;
    }
    axios.get(`${API}/departments/${encodeURIComponent(departmentCode)}/doctors`).then((res) => {
      setDoctors(res.data.map((d: { name: string }) => ({ value: d.name, label: d.name })));
    });
  }, [departmentCode]);

  const handleClear = () => {
    setMedicalNo("");
    setPatientName("");
    setGender("");
    setVisitType("");
    setBirthday("");
    setAge("");
    setPhone("");
    setCityName("");
    setDistrictName("");
    setAddress("");
    setRegDate(new Date().toISOString().slice(0, 10));
    setRegPeriod("");
    setDepartmentCode("");
    setDoctorName("");
    setRegNumber("--");
    setRegDeptName("");
    setMedicalNoTouched(false);
  };

  const handleConfirm = async () => {
    if (!medicalNo || !patientName || !regDate || !regPeriod || !departmentCode || !doctorName) {
      alert("請填寫必要欄位：病歷號碼、姓名、掛號日期、掛號時段、科別、醫師");
      return;
    }
    setMedicalNoTouched(true);
    if (!idValidation.valid) {
      alert("病歷號碼格式錯誤：" + idValidation.message);
      return;
    }

    try {
      // 1. Create or find patient
      const existing = await axios.get(`${API}/patients`, { params: { medical_no: medicalNo } });

      const patientData = {
        medical_no: medicalNo,
        name: patientName,
        gender: gender || null,
        birthday: birthday || null,
        age: age ? Number(age) : null,
        phone: phone || null,
        city_name: cityName || null,
        district_name: districtName || null,
        address: address || null,
      };

      if (existing.data) {
        // Update existing patient with edited info
        await axios.put(`${API}/patients/${encodeURIComponent(medicalNo)}`, patientData);
      } else {
        // Create new patient
        await axios.post(`${API}/patients`, patientData);
      }

      // 2. Create registration
      const regRes = await axios.post(`${API}/registrations`, {
        patient_medical_no: medicalNo,
        visit_type: visitType || null,
        reg_date: regDate,
        reg_period: regPeriod,
        department_code: departmentCode,
        doctor_name: doctorName,
      });

      setRegNumber(regRes.data.reg_number);
      setRegDeptName(regRes.data.department_name);
      alert("掛號成功！");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      alert("掛號失敗：" + (error.response?.data?.error || "未知錯誤"));
    }
  };

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div
        style={{
          width: 960,
          maxWidth: "100%",
          maxHeight: "calc(100vh - 32px)",
          borderRadius: 20,
          overflow: "auto",
          backgroundColor: "#F7F6F3",
          boxShadow: "0 8px 30px #00000008",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center"
          style={{
            height: 56,
            flexShrink: 0,
            background: "linear-gradient(135deg, #7C9070, #5A7050)",
            borderRadius: "20px 20px 0 0",
            padding: "0 20px",
          }}
        >
          <div className="flex items-center gap-3" style={{ flex: 1, justifyContent: "center" }}>
            <Hospital style={{ width: 24, height: 24, color: "#fff" }} />
            <span
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: 1,
                color: "#fff",
                textShadow: "0 2px 4px #00000030",
              }}
            >
              安康綜合醫院
            </span>
          </div>
          <Link
            to="/data"
            className="flex items-center gap-1.5"
            style={{
              color: "#fff",
              textDecoration: "none",
              padding: "6px 12px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
            }}
            title="資料查詢"
          >
            <Database style={{ width: 14, height: 14 }} />
            資料查詢
          </Link>
        </div>

        {/* Accent line */}
        <div style={{ height: 2, backgroundColor: "#7C907030" }} />

        {/* ── Patient Info Section ── */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "16px 24px",
            borderRadius: 16,
            border: "1px solid #F0EFEC",
            boxShadow: "0 4px 30px #00000006",
          }}
        >
          <div className="mb-3 flex items-center gap-2.5">
            <User style={{ width: 20, height: 20, color: "#7C9070" }} />
            <span style={{ fontSize: 17, fontWeight: 600, color: "#2D2D2D" }}>病患資訊</span>
          </div>

          {/* Row 1 */}
          <div className="flex items-end gap-4">
            <FormInput
              label="病歷號碼"
              placeholder="A123456789"
              width="160px"
              value={medicalNo}
              maxLength={10}
              error={medicalNoError}
              onChange={(v) => {
                setMedicalNo(v.toUpperCase());
                setMedicalNoTouched(true);
              }}
            />
            <FormInput label="姓名" width="140px" value={patientName} onChange={setPatientName} />
            <FormSelect label="性別" width="100px" value={gender} onChange={setGender}
              options={[{ value: "male", label: "男" }, { value: "female", label: "女" }]}
            />
            <FormSelect label="初複診" width="120px" value={visitType} onChange={setVisitType}
              options={[{ value: "first", label: "初診" }, { value: "return", label: "複診" }]}
            />
          </div>

          <div className="my-3"><Divider /></div>

          {/* Row 2 */}
          <div className="flex items-end gap-4">
            <FormDateInput label="生日" width="160px" value={birthday} onChange={setBirthday} />
            <FormInput label="年齡" width="80px" value={age} onChange={setAge} placeholder="自動計算" />
            <FormInput label="電話" width="180px" value={phone} onChange={setPhone} />
          </div>

          <div className="my-3"><Divider /></div>

          {/* Row 3 - Address: city → district cascade */}
          <div className="flex items-end gap-4">
            <FormSelect label="縣市" width="140px" value={cityName} onChange={setCityName} options={cities} />
            <FormSelect label="區域" width="140px" value={districtName} onChange={setDistrictName} options={districts} />
            <FormInput label="詳細地址" value={address} onChange={setAddress} />
          </div>

          <div className="mt-3"><Divider /></div>
        </div>

        {/* ── Registration Details Section ── */}
        <div
          style={{
            background: "linear-gradient(180deg, #FAFAF8, #F7F6F3)",
            padding: "16px 24px",
            borderRadius: 16,
            border: "1px solid #F0EFEC",
          }}
        >
          <div className="mb-3 flex items-center gap-2.5">
            <CalendarCheck style={{ width: 20, height: 20, color: "#7C9070" }} />
            <span style={{ fontSize: 17, fontWeight: 600, color: "#2D2D2D" }}>門診預約</span>
          </div>

          {/* Row: department → doctor cascade */}
          <div className="flex items-end gap-4">
            <FormDateInput label="掛號日期" width="160px" value={regDate} onChange={setRegDate} />
            <FormSelect label="掛號時段" width="120px" value={regPeriod} onChange={setRegPeriod}
              options={[{ value: "morning", label: "上午" }, { value: "afternoon", label: "下午" }]}
            />
            <FormSelect label="科別" width="180px" value={departmentCode} onChange={setDepartmentCode} options={departments} />
            <FormSelect label="醫師" width="180px" value={doctorName} onChange={setDoctorName} options={doctors} />
          </div>

          <div className="my-3"><Divider /></div>

          {/* Registration Number + Department */}
          <div
            className="flex items-center justify-center gap-8"
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: "16px 0",
              boxShadow: "0 4px 30px #7C907015",
            }}
          >
            <div className="flex flex-col gap-1.5">
              <span style={{ fontSize: 18, fontWeight: 500, color: "#2D2D2D" }}>掛號號碼</span>
              <span style={{ fontSize: 11, fontWeight: 400, letterSpacing: 0.5, color: "#8E8E93" }}>
                Registration Number
              </span>
            </div>
            <div className="flex items-center gap-4">
              {regDeptName && (
                <div
                  className="flex items-center justify-center"
                  style={{
                    height: 72,
                    padding: "0 20px",
                    borderRadius: 12,
                    backgroundColor: "#F7FAF8",
                    border: "1px solid #7C907040",
                  }}
                >
                  <span style={{ fontSize: 20, fontWeight: 600, color: "#5A7050" }}>
                    {regDeptName}
                  </span>
                </div>
              )}
              <div
                className="flex items-center justify-center"
                style={{
                  width: 120,
                  height: 72,
                  borderRadius: 12,
                  border: "2px solid #7C9070",
                  background: "linear-gradient(180deg, #fff, #F7FAF8)",
                  boxShadow: "0 4px 20px #7C907020",
                }}
              >
                <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: 2, color: "#7C9070" }}>
                  {regNumber}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div
          className="flex flex-col items-center justify-center gap-3.5"
          style={{
            flexShrink: 0,
            background: "linear-gradient(180deg, #7C9070, #5A7050)",
            borderRadius: "0 0 20px 20px",
            padding: "14px 40px",
          }}
        >
          <div className="flex items-center justify-center gap-4">
            <ActionButton
              icon={<Check style={{ width: 16, height: 16, color: "#fff" }} />}
              label="確認掛號"
              gradient="linear-gradient(180deg, #4A5D43, #3D4E38)"
              onClick={handleConfirm}
            />
            <ActionButton
              icon={<Printer style={{ width: 16, height: 16, color: "#fff" }} />}
              label="列印掛號單"
              gradient="linear-gradient(180deg, #4A5D43, #3D4E38)"
              onClick={() => window.print()}
            />
            <ActionButton
              icon={<RefreshCw style={{ width: 16, height: 16, color: "#fff" }} />}
              label="清除畫面"
              gradient="linear-gradient(180deg, #8E9B87, #7C8A75)"
              onClick={handleClear}
            />
            <ActionButton
              icon={<LogOut style={{ width: 16, height: 16, color: "#fff" }} />}
              label="結束離開"
              gradient="linear-gradient(180deg, #A0A8A5, #8E9691)"
              onClick={() => window.close()}
            />
          </div>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
            © 2024 安康綜合醫院 掛號系統 v2.0
          </span>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
