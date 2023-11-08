import "../App.css";
import { NavbarData } from "./NavbarData";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import EmojiEventsIcon from "@material-ui/icons/EmojiEvents";

const icons = {
  HomeIcon: <HomeIcon />,
  PersonIcon: <PersonIcon />,
  LeaderboardIcon: <InsertChartIcon />,
  EmojiEventsIcon: <EmojiEventsIcon />,
};
function Navbar() {
  return (
    <div className="App">
      <div className="SideBar">
        <ul className="SideBarList">
          {NavbarData.map((val, key) => {
            return (
              <li
                key={key}
                className="SideBarList li"
                id={window.location.pathname === val.link ? "active" : ""}
                onClick={() => {
                  window.location.pathname = val.link;
                }}
              >
                <div className="flex-container">
                  <div id="icon">{icons[val.icon]}</div>
                  <div id="title">{val.title}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
export default Navbar;
