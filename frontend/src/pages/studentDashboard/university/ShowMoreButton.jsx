/*
Author:
  - Aasif Faizal (aasif@dal.ca)

This component is a custom bootstrap accordion button used for toggling.
*/

import {AccordionContext, Button, useAccordionButton} from "react-bootstrap";
import {useContext} from "react";

function ShowMoreButton({ eventKey, callback}) {
  const { activeEventKey } = useContext(AccordionContext);
  const onClick = useAccordionButton(eventKey, () => callback && callback(eventKey));
  return (
    <Button variant="outline-secondary" onClick={onClick}>
      {activeEventKey === eventKey? 'Less Details' : 'More Details'}
    </Button>
  );
}

export default ShowMoreButton;