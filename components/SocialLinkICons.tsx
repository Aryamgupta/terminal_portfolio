interface Props{
  borderDir:string;
  link:string;
  content:string;
  icon:string
}
export default function SocialLinkICons(props:Props){
  return (
    <a
      style={{
        lineHeight: "47px",
        height: "47px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "row",
        textAlign: "center",
      }}
      className={`${props.borderDir} fontFadeColor`}
      href={props.link}
    >
      {window.innerWidth > 480 && (
        <p>
          {props.content}
        </p>
      )}
      <div className="p-3">{props.icon}</div>
    </a>
  );
};

