import { Icon } from "@iconify/react"
import ReactDOM from "react-dom/client"

const messageContainerStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 50,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.2)",
  backdropFilter: "blur(4px)"
}

const messageBoxStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  maxWidth: "32rem",
  borderRadius: "0.5rem",
  backgroundColor: "#fff",
  padding: "1.5rem",
  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)"
}

const messageContentStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  columnGap: "1rem"
}

const iconContainerStyle: React.CSSProperties = {
  display: "flex",
  height: "2.5rem",
  width: "2.5rem",
  flexShrink: 0,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "9999px",
  backgroundColor: "#ffedd5"
}

const iconStyle: React.CSSProperties = {
  height: "1.5rem",
  width: "1.5rem",
  color: "#ea580c"
}

const textContainerStyle: React.CSSProperties = {
  marginLeft: "1rem",
  flex: 1
}

const titleStyle: React.CSSProperties = {
  fontSize: "1.125rem",
  fontWeight: 600,
  color: "#1f2937"
}

const subTitleStyle: React.CSSProperties = {
  marginTop: "0.25rem",
  fontSize: "0.875rem",
  color: "#6b7280"
}

export const Message = (option) => {
  const { title, subTitle } = option
  const containerDom = document.createElement("div")
  // Setting initial styles for the container
  Object.assign(containerDom.style, messageContainerStyle)

  const container = ReactDOM.createRoot(containerDom)

  container.render(
    <div style={messageBoxStyle}>
      <div style={messageContentStyle}>
        <div style={iconContainerStyle}>
          <Icon icon="eos-icons:arrow-rotate" style={iconStyle} />
        </div>
        <div style={textContainerStyle}>
          <div style={titleStyle}>{title}</div>
          {subTitle && <div style={subTitleStyle}>{subTitle}</div>}
        </div>
      </div>
    </div>
  )

  return containerDom
}
