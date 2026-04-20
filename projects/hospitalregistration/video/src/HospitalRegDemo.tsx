import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Sequence,
} from "remotion";

/* ─── Color Tokens ─── */
const C = {
  headerGrad1: "#7C9070",
  headerGrad2: "#5A7050",
  bg: "#F7F6F3",
  card: "#FFFFFF",
  border: "#F0EFEC",
  inputBorder: "#9DA4B3",
  text: "#333333",
  title: "#2D2D2D",
  accent: "#7C9070",
  placeholder: "#5B5F66",
  error: "#A62911",
  btnGreen1: "#4A5D43",
  btnGreen2: "#3D4E38",
  btnMid1: "#8E9B87",
  btnMid2: "#7C8A75",
  btnGray1: "#A0A8A5",
  btnGray2: "#8E9691",
};

/* ─── Typing animation helper ─── */
function getTypedText(full: string, frame: number, startFrame: number, charsPerFrame = 0.15): string {
  const elapsed = Math.max(0, frame - startFrame);
  const count = Math.min(full.length, Math.floor(elapsed * charsPerFrame));
  return full.substring(0, count);
}

/* ─── Cursor blink ─── */
function Cursor({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <span style={{ borderRight: "2px solid #333", marginLeft: 1, animation: "none" }}>
      &nbsp;
    </span>
  );
}

/* ─── Simulated Form Input ─── */
function SimInput({
  label,
  value,
  placeholder,
  width,
  highlight,
  error,
  showCursor,
}: {
  label: string;
  value: string;
  placeholder?: string;
  width: number;
  highlight?: boolean;
  error?: string;
  showCursor?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, width }}>
      <span style={{ fontSize: 10, fontWeight: 500, color: C.text }}>{label}</span>
      <div
        style={{
          height: 28,
          border: `${highlight ? 2 : 1}px solid ${error ? C.error : highlight ? C.accent : C.inputBorder}`,
          backgroundColor: error ? "#FFF5F5" : C.card,
          padding: "4px 8px",
          fontSize: 11,
          color: value ? C.text : C.placeholder,
          display: "flex",
          alignItems: "center",
          boxShadow: highlight ? `0 0 0 2px ${C.accent}30` : "none",
          transition: "all 0.3s",
        }}
      >
        {value || placeholder || ""}
        {showCursor && <Cursor visible />}
      </div>
      {error && <span style={{ fontSize: 9, color: C.error }}>{error}</span>}
    </div>
  );
}

/* ─── Simulated Select ─── */
function SimSelect({
  label,
  value,
  placeholder = "請選擇",
  width,
  highlight,
}: {
  label: string;
  value: string;
  placeholder?: string;
  width: number;
  highlight?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, width }}>
      <span style={{ fontSize: 10, fontWeight: 500, color: C.text }}>{label}</span>
      <div
        style={{
          height: 28,
          border: `${highlight ? 2 : 1}px solid ${highlight ? C.accent : C.inputBorder}`,
          backgroundColor: C.card,
          padding: "4px 8px",
          fontSize: 11,
          color: value ? C.text : C.placeholder,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: highlight ? `0 0 0 2px ${C.accent}30` : "none",
        }}
      >
        <span>{value || placeholder}</span>
        <span style={{ fontSize: 10, color: C.placeholder }}>▼</span>
      </div>
    </div>
  );
}

/* ─── Simulated Date Input ─── */
function SimDate({
  label,
  value,
  width,
  highlight,
}: {
  label: string;
  value: string;
  width: number;
  highlight?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, width }}>
      <span style={{ fontSize: 10, fontWeight: 500, color: C.text }}>{label}</span>
      <div
        style={{
          height: 28,
          border: `${highlight ? 2 : 1}px solid ${highlight ? C.accent : C.inputBorder}`,
          backgroundColor: C.card,
          padding: "4px 8px",
          fontSize: 11,
          color: value ? C.text : C.placeholder,
          display: "flex",
          alignItems: "center",
          boxShadow: highlight ? `0 0 0 2px ${C.accent}30` : "none",
        }}
      >
        {value || "YYYY-MM-DD"}
      </div>
    </div>
  );
}

/* ─── Action Button ─── */
function SimButton({
  label,
  grad1,
  grad2,
  highlight,
  pulse,
}: {
  label: string;
  grad1: string;
  grad2: string;
  highlight?: boolean;
  pulse?: boolean;
}) {
  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${grad1}, ${grad2})`,
        borderRadius: 8,
        padding: "7px 16px",
        display: "flex",
        alignItems: "center",
        gap: 6,
        boxShadow: highlight ? `0 0 0 3px ${C.accent}60` : "0 2px 10px #00000015",
        transform: pulse ? "scale(1.08)" : "scale(1)",
        transition: "transform 0.2s",
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{label}</span>
    </div>
  );
}

/* ─── Divider ─── */
function Divider() {
  return <div style={{ height: 1, width: "100%", backgroundColor: C.border }} />;
}

/* ─── Step Overlay ─── */
function StepOverlay({
  step,
  title,
  subtitle,
  opacity,
}: {
  step: number;
  title: string;
  subtitle: string;
  opacity: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        right: 20,
        backgroundColor: "rgba(74, 124, 89, 0.95)",
        borderRadius: 12,
        padding: "10px 18px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity,
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 16,
          color: C.headerGrad2,
        }}
      >
        {step}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{title}</span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.75)" }}>{subtitle}</span>
      </div>
    </div>
  );
}

/* ─── Success Overlay ─── */
function SuccessOverlay({ opacity, scale }: { opacity: number; scale: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: `rgba(0,0,0,${opacity * 0.3})`,
        opacity,
        zIndex: 20,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: "24px 40px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.headerGrad1}, ${C.headerGrad2})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            color: "#fff",
          }}
        >
          ✓
        </div>
        <span style={{ fontSize: 18, fontWeight: 600, color: C.title }}>掛號成功！</span>
        <span style={{ fontSize: 12, color: C.placeholder }}>Registration Confirmed</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPOSITION
   Timeline (30fps, 900 frames = 30s):
   0-90:     Title screen
   90-120:   Transition to app
   120-240:  Step 1: Type medical number
   240-330:  Step 2: Auto-fill patient data
   330-420:  Step 3: Confirm patient info
   420-570:  Step 4: Select registration info
   570-690:  Step 5: Confirm registration
   690-810:  Step 6: Show result
   810-900:  Ending
   ═══════════════════════════════════════════ */

export const HospitalRegDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Data states based on frame ──
  const medicalNo = "A123456789";
  const typedMedicalNo = getTypedText(medicalNo, frame, 140, 0.12);
  const medicalNoDone = frame >= 230;

  // After auto-fill (frame 260+)
  const autoFilled = frame >= 260;
  const patientName = autoFilled ? "王小明" : "";
  const gender = autoFilled ? "男" : "";
  const visitType = autoFilled ? "複診" : "";
  const birthday = autoFilled ? "1990-05-15" : "";
  const age = autoFilled ? "35" : "";
  const phone = autoFilled ? "0912345678" : "";
  const cityName = autoFilled ? "台北市" : "";
  const districtName = frame >= 280 ? "大安區" : "";
  const address = frame >= 290 ? "和平東路一段100號" : "";

  // Registration section (frame 430+)
  const regDate = "2026-04-07";
  const regPeriod = frame >= 460 ? "上午" : "";
  const deptName = frame >= 490 ? "內科" : "";
  const doctorName = frame >= 530 ? "王建明" : "";

  // Reg number result
  const regConfirmed = frame >= 620;
  const regNumber = regConfirmed ? "03" : "--";
  const regDeptLabel = regConfirmed ? "內科" : "";

  // Highlights
  const hlMedical = frame >= 130 && frame < 240;
  const hlPatientInfo = frame >= 250 && frame < 330;
  const hlRegDate = frame >= 430 && frame < 460;
  const hlPeriod = frame >= 450 && frame < 490;
  const hlDept = frame >= 480 && frame < 530;
  const hlDoctor = frame >= 520 && frame < 570;
  const hlConfirmBtn = frame >= 580 && frame < 630;

  // Step overlay
  let stepInfo = { step: 0, title: "", subtitle: "" };
  if (frame >= 130 && frame < 240) stepInfo = { step: 1, title: "輸入病歷號碼", subtitle: "台灣身分證字號 10 碼" };
  else if (frame >= 240 && frame < 340) stepInfo = { step: 2, title: "系統自動帶入", subtitle: "舊病患資料自動填入" };
  else if (frame >= 340 && frame < 430) stepInfo = { step: 3, title: "確認病患資訊", subtitle: "檢查並修改資料" };
  else if (frame >= 430 && frame < 580) stepInfo = { step: 4, title: "選擇門診資訊", subtitle: "日期 → 時段 → 科別 → 醫師" };
  else if (frame >= 580 && frame < 690) stepInfo = { step: 5, title: "確認掛號", subtitle: "點擊確認掛號按鈕" };
  else if (frame >= 690 && frame < 810) stepInfo = { step: 6, title: "掛號完成", subtitle: "取得掛號號碼" };

  const stepOpacity = stepInfo.step > 0 ? 1 : 0;

  // Title screen
  const titleOpacity = interpolate(frame, [0, 30, 80, 100], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const appOpacity = interpolate(frame, [90, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Success overlay
  const successOpacity = interpolate(frame, [640, 660], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const successScale = spring({ frame: frame - 640, fps, config: { damping: 12, stiffness: 150 } });

  // Ending
  const endOpacity = interpolate(frame, [810, 840, 880, 900], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Auto-fill flash effect
  const flashOpacity = interpolate(frame, [255, 260, 270, 285], [0, 0.15, 0.15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#E8E6E1" }}>
      {/* ── Title Screen ── */}
      {frame < 110 && (
        <AbsoluteFill
          style={{
            background: `linear-gradient(135deg, ${C.headerGrad1}, ${C.headerGrad2})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            opacity: titleOpacity,
          }}
        >
          <div style={{ fontSize: 42, fontWeight: 700, color: "#fff", letterSpacing: 3, textShadow: "0 3px 6px rgba(0,0,0,0.3)" }}>
            安康綜合醫院
          </div>
          <div style={{ fontSize: 22, fontWeight: 500, color: "rgba(255,255,255,0.85)", letterSpacing: 2 }}>
            門診掛號系統 操作示範
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 20 }}>
            Hospital Registration System Demo
          </div>
        </AbsoluteFill>
      )}

      {/* ── App UI ── */}
      <AbsoluteFill
        style={{
          opacity: appOpacity,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 30,
        }}
      >
        <div
          style={{
            width: 780,
            borderRadius: 16,
            overflow: "hidden",
            backgroundColor: C.bg,
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              height: 44,
              background: `linear-gradient(135deg, ${C.headerGrad1}, ${C.headerGrad2})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 600, color: "#fff", letterSpacing: 1 }}>
              🏥 安康綜合醫院
            </span>
          </div>

          <div style={{ height: 2, backgroundColor: `${C.accent}30` }} />

          {/* Patient Info Section */}
          <div
            style={{
              backgroundColor: C.card,
              padding: "12px 20px",
              border: `1px solid ${C.border}`,
              position: "relative",
            }}
          >
            {/* Flash effect on auto-fill */}
            {flashOpacity > 0 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: `${C.accent}`,
                  opacity: flashOpacity,
                  borderRadius: 0,
                  pointerEvents: "none",
                }}
              />
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.title }}>👤 病患資訊</span>
            </div>

            {/* Row 1 */}
            <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
              <SimInput
                label="病歷號碼"
                value={medicalNoDone ? medicalNo : typedMedicalNo}
                placeholder="A123456789"
                width={130}
                highlight={hlMedical}
                showCursor={hlMedical && !medicalNoDone}
              />
              <SimInput label="姓名" value={patientName} width={110} highlight={hlPatientInfo} />
              <SimSelect label="性別" value={gender} width={80} highlight={hlPatientInfo} />
              <SimSelect label="初複診" value={visitType} width={100} highlight={hlPatientInfo} />
            </div>

            <Divider />

            {/* Row 2 */}
            <div style={{ display: "flex", gap: 12, margin: "8px 0" }}>
              <SimDate label="生日" value={birthday} width={130} highlight={hlPatientInfo} />
              <SimInput label="年齡" value={age} placeholder="自動計算" width={65} highlight={hlPatientInfo} />
              <SimInput label="電話" value={phone} width={145} highlight={hlPatientInfo} />
            </div>

            <Divider />

            {/* Row 3 */}
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <SimSelect label="縣市" value={cityName} width={110} highlight={hlPatientInfo} />
              <SimSelect label="區域" value={districtName} width={110} highlight={hlPatientInfo} />
              <SimInput label="詳細地址" value={address} width={300} highlight={hlPatientInfo} />
            </div>
          </div>

          {/* Registration Section */}
          <div
            style={{
              background: `linear-gradient(180deg, #FAFAF8, ${C.bg})`,
              padding: "12px 20px",
              border: `1px solid ${C.border}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.title }}>📅 門診預約</span>
            </div>

            {/* Row */}
            <div style={{ display: "flex", gap: 12 }}>
              <SimDate label="掛號日期" value={regDate} width={130} highlight={hlRegDate} />
              <SimSelect label="掛號時段" value={regPeriod} width={100} highlight={hlPeriod} />
              <SimSelect label="科別" value={deptName} width={145} highlight={hlDept} />
              <SimSelect label="醫師" value={doctorName} width={145} highlight={hlDoctor} />
            </div>

            <div style={{ margin: "10px 0" }}><Divider /></div>

            {/* Reg Number Display */}
            <div
              style={{
                backgroundColor: C.card,
                borderRadius: 10,
                padding: "12px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 30,
                boxShadow: `0 4px 20px ${C.accent}15`,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 15, fontWeight: 500, color: C.title }}>掛號號碼</span>
                <span style={{ fontSize: 9, color: "#8E8E93", letterSpacing: 0.5 }}>Registration Number</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {regDeptLabel && (
                  <div
                    style={{
                      height: 56,
                      padding: "0 16px",
                      borderRadius: 10,
                      backgroundColor: "#F7FAF8",
                      border: `1px solid ${C.accent}40`,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 600, color: C.headerGrad2 }}>{regDeptLabel}</span>
                  </div>
                )}
                <div
                  style={{
                    width: 90,
                    height: 56,
                    borderRadius: 10,
                    border: `2px solid ${C.accent}`,
                    background: "linear-gradient(180deg, #fff, #F7FAF8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: regConfirmed ? `0 4px 20px ${C.accent}30` : "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: 32,
                      fontWeight: 600,
                      letterSpacing: 2,
                      color: C.accent,
                    }}
                  >
                    {regNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              background: `linear-gradient(180deg, ${C.headerGrad1}, ${C.headerGrad2})`,
              padding: "10px 30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              <SimButton label="✓ 確認掛號" grad1={C.btnGreen1} grad2={C.btnGreen2} highlight={hlConfirmBtn} pulse={hlConfirmBtn} />
              <SimButton label="🖨 列印掛號單" grad1={C.btnGreen1} grad2={C.btnGreen2} />
              <SimButton label="↻ 清除畫面" grad1={C.btnMid1} grad2={C.btnMid2} />
              <SimButton label="⏻ 結束離開" grad1={C.btnGray1} grad2={C.btnGray2} />
            </div>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>
              © 2024 安康綜合醫院 掛號系統 v2.0
            </span>
          </div>
        </div>

        {/* Step Overlay */}
        {stepInfo.step > 0 && (
          <StepOverlay
            step={stepInfo.step}
            title={stepInfo.title}
            subtitle={stepInfo.subtitle}
            opacity={1}
          />
        )}
      </AbsoluteFill>

      {/* Success Overlay */}
      {frame >= 640 && frame < 750 && (
        <SuccessOverlay opacity={successOpacity} scale={successScale} />
      )}

      {/* ── Ending Screen ── */}
      {frame >= 810 && (
        <AbsoluteFill
          style={{
            background: `linear-gradient(135deg, ${C.headerGrad1}, ${C.headerGrad2})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            opacity: endOpacity,
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: 2 }}>
            操作示範結束
          </div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.7)" }}>
            安康綜合醫院 門診掛號系統
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
