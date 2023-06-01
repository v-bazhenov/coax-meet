import {useTranslation} from 'react-i18next';

const Footer = () => {
    const {i18n} = useTranslation();

    function changeLanguage(e) {
        window.location.reload();
        const selectedLanguage = e.target.value;
        i18n.changeLanguage(selectedLanguage);
        localStorage.setItem('language', selectedLanguage);
    }

    return (
        <div className='footer' align="center">
            <button onClick={changeLanguage} value='en'>English</button>
            <span>&nbsp;</span>
            <button onClick={changeLanguage} value='uk'>Українська</button>
        </div>
    )
}
export default Footer;
