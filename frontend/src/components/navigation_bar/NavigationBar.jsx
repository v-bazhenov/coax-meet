import React, {Component} from "react";
import {withRouter} from "react-router";

// Material UI components
import {withStyles} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Tooltip from "@material-ui/core/Tooltip";
import {withTranslation} from "react-i18next";

// Utility components, functions, constants, objects...
import {
    UserInfoContext,
    AVAILABLE_PATHS,
    ALL_PATH_TITLES,
} from "../utilities";
import navigationBarStyles from "./navigation_bar_styles";

class NavigationBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            pageTitle: this.changePageTitle(),
            isComponentShown: false,
        };
    }

    // Title changes based on what url path user is on
    changePageTitle = () => {
        const {t} = this.props;
        const currentUrlPath = this.props.location.pathname;
        const {LOBBY_PATH, LOGIN_PATH, REGISTER_PATH} = AVAILABLE_PATHS;

        const {LOBBY_TITLE, LOGIN_TITLE, REGISTER_TITLE} = ALL_PATH_TITLES;

        let pageTitle;
        switch (currentUrlPath) {
            case LOBBY_PATH:
                pageTitle = LOBBY_TITLE;
                break;
            case LOGIN_PATH:
                pageTitle = LOGIN_TITLE;
                break;
            case REGISTER_PATH:
                pageTitle = REGISTER_TITLE;
                break;
            default:
                pageTitle = "";
                break;
        }

        if (currentUrlPath.match("/video/")) {
            pageTitle = t("Room");
        }
        this.setState({
            pageTitle: pageTitle,
        });
        return pageTitle;
    };

    static contextType = UserInfoContext;

    // Method to open menu items
    handleMenuOpen = (event) => {
        this.setState({
            anchorEl: event.currentTarget,
        });
    };

    // Logic to handle each menu item's action
    menuAction = (event) => {
        const {t} = this.props;
        const {history, authenticateUser, printFeedback} = this.props;
        const {menu} = event.currentTarget.dataset;
        const {LOBBY_PATH, LOGIN_PATH, REGISTER_PATH, DELETE_ACCOUNT_PATH} = AVAILABLE_PATHS;
        const {
            LOBBY_TITLE,
            LOGIN_TITLE,
            REGISTER_TITLE,
            LOGOUT_TITLE,
            DELETE_ACCOUNT_TITLE
        } = ALL_PATH_TITLES;
        if (menu && history) {
            switch (menu) {
                case LOBBY_TITLE:
                    history.push(LOBBY_PATH);
                    break;
                case LOGIN_TITLE:
                    history.push(LOGIN_PATH);
                    break;
                case DELETE_ACCOUNT_TITLE:
                    history.push(DELETE_ACCOUNT_PATH);
                    break;
                case LOGOUT_TITLE:
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                    authenticateUser();
                    printFeedback({
                        type: "success",
                        feedbackMsg: t("Logged out successfully"),
                    });
                    history.push(LOBBY_PATH);

                    break;
                case REGISTER_TITLE:
                    history.push(REGISTER_PATH);
                    break;
                default:
                    break;
            }
        }
        this.setState({
            anchorEl: null,
        });
    };

    // Method to hide 'Search bar' and 'create room button' if url is not the default route
    showComponents = () => {
        this.changePageTitle();
        if (this.props.location.pathname !== "/") {
            this.setState({
                isComponentShown: false,
            });
        } else {
            this.setState({
                isComponentShown: true,
            });
        }
    };

    // This method fires when the component mounts
    componentDidMount = () => {
        this.showComponents();
    };

    // And if the route is changed
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.showComponents();
            this.changePageTitle();
        }
    }

    render() {
        const {t} = this.props;
        const {classes, openRoomForm, search, handleSearchChanges} = this.props;
        const {anchorEl, pageTitle, isComponentShown} = this.state;
        const {userFullName, isUserLoggedIn} = this.context;
        const {
            LOBBY_TITLE,
            LOGIN_TITLE,
            REGISTER_TITLE,
            LOGOUT_TITLE,
            DELETE_ACCOUNT_TITLE
        } = ALL_PATH_TITLES;

        // Menu items changes based on whether user is logged in or not
        const menuItems = isUserLoggedIn
            ? [LOBBY_TITLE, LOGOUT_TITLE, DELETE_ACCOUNT_TITLE]
            : [LOBBY_TITLE, LOGIN_TITLE, REGISTER_TITLE];
        return (
            <div className={classes.root}>
                <AppBar className={classes.appBar} position="static">
                    <Toolbar>
                        {/* Page Title */}
                        <Typography className={classes.pageTitle} variant="h6">
                            {t(pageTitle)}
                        </Typography>

                        {/* Search Bar */}
                        {isComponentShown ? (
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon/>
                                </div>
                                <InputBase
                                    value={search}
                                    onChange={handleSearchChanges}
                                    placeholder={t("Search room title")}
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                />
                            </div>
                        ) : null}

                        {/* Create room button */}
                        <div className={classes.root}/>
                        {isComponentShown && isUserLoggedIn ? (
                            <Tooltip title={t('Create Room')}>
                                <IconButton onClick={openRoomForm} color="inherit">
                                    <AddCircleOutlineIcon/>
                                </IconButton>
                            </Tooltip>
                        ) : null}

                        {/* User full name */}
                        <Typography className={classes.username} variant="subtitle1">
                            {userFullName && userFullName !== "" ? userFullName : t("Anonymous")}
                        </Typography>

                        {/* Menus */}
                        <Tooltip title={t('Menu')}>
                            <IconButton
                                onClick={this.handleMenuOpen}
                                edge="start"
                                color="inherit"
                            >
                                <MenuIcon/>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={anchorEl}
                            anchorOrigin={{vertical: "top", horizontal: "right"}}
                            transformOrigin={{vertical: "top", horizontal: "right"}}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={this.menuAction}
                        >
                            {menuItems.map((item, index) => (
                                <MenuItem
                                    key={index}
                                    data-menu={item}
                                    onClick={this.menuAction}
                                >
                                    {t(item)}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(navigationBarStyles)(
    withTranslation()(withRouter(NavigationBar))
);