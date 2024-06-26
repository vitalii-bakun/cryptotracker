import { Form, ListGroup, Badge, Modal } from 'react-bootstrap';
import { useState } from 'react';
import AssetsService from '../service/AssetsService';
import { Loading } from './Loading';
import { ErrorMessage } from './ErrorMessage';
import { useTranslation } from 'react-i18next';
import DetailedAsset from './DetailedAsset';

export function ModalSearch({ show, handleClose }) {
    const { t } = useTranslation();
    const [searchResults, setSearchResults] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearchAssets = (event) => {
        const value = event.target.value;

        setIsLoading(true);

        AssetsService.getAll(0, 10, value)
            .then((data) => setSearchResults(data))
            .catch((error) => setErrorMessage(error.message))
            .finally(() => setIsLoading(false));
    };


    return (
        <Modal show={show}
            fullscreen="sm-down"
            onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{t('search.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Control
                    type="search"
                    placeholder={t('search.placeholder')}
                    onChange={handleSearchAssets} />
                {errorMessage && <ErrorMessage message={errorMessage} />}
                <br />
                {isLoading && <Loading />}
                <ListGroup as="ol" numbered>
                    {searchResults && searchResults.map((asset) => (
                        <ListGroup.Item
                            as="li"
                            key={asset.id}
                            className="d-flex justify-content-between align-items-center">
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">
                                    <DetailedAsset asset={asset} variant={'link'}>
                                        {asset.name}
                                    </DetailedAsset>
                                </div>
                            </div>
                            <Badge bg="primary" pill>
                                {asset.symbol}
                            </Badge>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Modal.Body>
        </Modal>
    );
}
