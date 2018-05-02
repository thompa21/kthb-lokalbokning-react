import React, { Component } from 'react';
import '../App.css';

import { deleteCookie } from '../utils/cookies';

class KthHeader extends Component {

    constructor () {
        super()
        this.state = { isLoggedIn: false };
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
    }

    componentDidMount() {
    }

    login () {
        window.location.href = 'https://apps.lib.kth.se/jwt/jwttokenkthcas.php?returl=https://apps.lib.kth.se/lokalbokning';
    }

    logout () {
        deleteCookie('kthb_jwt');
        window.location.href = 'https://apps.lib.kth.se/jwt/jwttokenkthcas_logout.php?returl=https://apps.lib.kth.se/lokalbokning';
    }

    render() {
        //isLoggedIn från parent
        const isLoggedIn = this.props.isLoggedIn
        return (
            <div className="kthheader">
                <div className="kthheaderlogo">
                    <div className="floatleft">
                        <div id="logo">
                            <a href="https://www.kth.se/en">
                                <img src="https://apps.lib.kth.se/mrbs/images/KTH_Logotyp_RGB_2013-2.svg" alt="KTHB"/>
                            </a>
                        </div>
                    </div>
                    <div id="banner" className="floatright">
                        <input type="hidden" name="datatable" value="1"/>
                        <div className="floatright width100percent">
                            {!isLoggedIn ? (
                                <button className="kthbutton" onClick={this.login}>Logga in</button>
                            ) : (
                                <button className="kthbutton" onClick={this.logout}>Logga ut</button>  
                            )}
                        </div>
                    </div> 	
                </div>
                <div className = "kthheadertext">
                    <span>KTH Biblioteket - Lokalbokningar</span>
                </div>
            </div>
        );
    }
}

export default KthHeader;