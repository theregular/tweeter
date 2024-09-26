import { OverlayTrigger, Tooltip } from "react-bootstrap";
import useToastListener from "../toaster/ToastListenerHook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const OAuth = () => {
  const platforms = [
    { platform: "Google", tooltip: "google" },
    { platform: "Facebook", tooltip: "facebook" },
    { platform: "Twitter", tooltip: "twitter" },
    { platform: "LinkedIn", tooltip: "linkedIn" },
    { platform: "GitHub", tooltip: "github" },
  ];
  return (
    <div className="text-center mb-3">
      {platforms.map(({ platform, tooltip }) => (
        <OAuthButton key={platform} platform={platform} tooltip={tooltip} />
      ))}
    </div>
  );
};

interface OAuthButtonProps {
  platform: string;
  tooltip: string;
  //   icon: [string, string];
}

const OAuthButton = (props: OAuthButtonProps) => {
  const { displayInfoMessage } = useToastListener();
  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayInfoMessage(message, 3000, "text-white bg-primary");
  };

  return (
    <button
      type="button"
      className="btn btn-link btn-floating mx-1"
      onClick={() =>
        displayInfoMessageWithDarkBackground(
          `${props.platform} registration is not implemented.`
        )
      }
    >
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id={`${props.tooltip}Tooltip`}>{props.platform}</Tooltip>
        }
      >
        <FontAwesomeIcon
          icon={["fab", `${props.platform.toLowerCase()}`] as IconProp}
        />
      </OverlayTrigger>
    </button>
  );
};

export default OAuth;
