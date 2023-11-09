import "./Navbar.css";
import { NavbarData } from "./NavbarData";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PersonIcon from "@mui/icons-material/Person";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LoginIcon from '@mui/icons-material/Login';

const icons = {
  PlayCircleIcon: <PlayCircleIcon />,
  LoginIcon: <LoginIcon />,
  PersonIcon: <PersonIcon />,
  LeaderboardIcon: <InsertChartIcon />,
  EmojiEventsIcon: <EmojiEventsIcon />,
};

function Navbar({loginStatus}) {
  return (
    <div className="SideBar">
      <ul className="SideBarList">
        {/* List elements with icons and links */}
        {NavbarData.map((val, key) => {
          if (loginStatus == false && val.title == " Account") {
            return;
          } else if (loginStatus == true && val.title == " Login") {
            return
          }
          return (
            <li
              key={key}
              className={"SideBarList li " + (window.location.pathname == val.link ? "active" : "")}
              onClick={() => {
                window.location.pathname = val.link;
              }}
            >
              <div className="flex-container">
                <div className="icon">
                  {icons[val.icon]}
                </div>
                <div className="title">
                  {val.title}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
export default Navbar;
