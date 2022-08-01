/*
Author:
  - Aasif Faizal (aasif@dal.ca)

This component renders the University SearchUniversity page for students.
*/

import { Container, InputGroup, FormControl, Button, Row} from "react-bootstrap";
import { Search as SearchIcon } from 'react-bootstrap-icons';
import StudentNavbar from "../../../components/StudentNavbar";
import UniversityCard from "./UniversityCard";
import universityExternalService from "../../../api/UniversityExternalService";
import "./index.scss"
import { useState, useRef, useEffect} from "react";

const SearchUniversity = () => {
  const [universityList, setUniversityList] = useState([])
  const [more, setMore] = useState(false);
  const [page, setPage] = useState(0);
  const searchKeyRef = useRef(null);

  const filterUniversities = (searchKey) => {
    universityExternalService.fetchUniversities(searchKey, 0).then(result => {
      setUniversityList(result.data.universities)
      setMore(result.data.more)
      setPage(0)
    })
  }

  const handleOnEnter = (event) => {
    if(event.code === 'Enter') {
      filterUniversities(event.target.value);
    }
  }

  const onClick = (event) => {
    filterUniversities(searchKeyRef.current.value)
  }

  const loadMore = (event) => {
    universityExternalService.fetchUniversities(null, page + 1).then(result => {
      let newUniversityList = universityList.concat(result.data.universities)
      console.log(newUniversityList)
      setUniversityList(newUniversityList)
      setMore(result.data.more)
      setPage(page + 1)
    })
  }

  useEffect(() => {
    console.log('inside')
    universityExternalService.fetchUniversities(null, 0).then(result => {
      setUniversityList(result.data.universities)
      setMore(result.data.more)
      setPage(0)
    })
  }, [])

  return (
    <div>
      <StudentNavbar/>
      <Container className="search">
        <InputGroup className="mb-3 mt-4">
          <FormControl ref={searchKeyRef} onKeyPress={handleOnEnter} placeholder="Search" />
          <Button className="search_ico" onClick={onClick} variant="outline-secondary"> <SearchIcon/> </Button>
        </InputGroup>
        <Row xs={1} sm={2} lg={3}>
          {universityList.map(row => {
            return <UniversityCard key={row.id} university={row} />
          })}
        </Row>
        { more &&
          <Row className="justify-content-center mt-5">
            <Button onClick={loadMore} className="load-more-btn" variant="dark">Load More</Button>
          </Row>
        }
      </Container>
    </div>
  )
}

export default SearchUniversity;