import { useApp } from './providers/AppProvider';
import { Alert, Container } from 'react-bootstrap';
const Alert2 = () => {
    const { alert, setAlert } = useApp();

    return (
        <Container className="mt-3">
            {alert !== null &&
                <Alert show={alert !== null} onClose={() => setAlert(null)} variant={alert.variant} dismissible>
                    {alert.text}
                </Alert>
            }
        </Container>
    )
};

export default Alert2;
