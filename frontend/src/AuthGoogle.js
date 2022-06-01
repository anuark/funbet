import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function parseJwt (token) {
  console.log(token, 'token');
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function onSuccess(googleUser) {
  console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
}
function onFailure(error) {
  console.log(error);
}
function renderButton() {
  // gapi.signin2.render('g_id_signin', {
  //   'scope': 'profile email',
  //   'width': 240,
  //   'height': 50,
  //   'longtitle': true,
  //   'theme': 'dark',
  //   'onsuccess': onSuccess,
  //   'onfailure': onFailure
  // });
}

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    renderButton();
    window.handleCredentialResponse = (googleRes) => {
      console.log('handleCredentialResponse');
      console.log(parseJwt(googleRes.credential));

      // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      // console.log('Name: ' + profile.getName());
      // console.log('Image URL: ' + profile.getImageUrl());
      // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    }
  }, []);

  return (
    <Container>
      <Row><Col>You need to login first:</Col></Row>
      <Row><Col>
        <div className="g_id_signin" data-type="standard"></div>
      </Col></Row>
    <div id="g_id_onload"
         data-client_id="117742491586-plpcm4ova1f3h69m673u4jm5ud4amr2u.apps.googleusercontent.com"
         data-callback="handleCredentialResponse">
    </div>
    </Container>
  );
};

export default Auth;
