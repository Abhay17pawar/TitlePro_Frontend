import { useState } from "react"
import { Form, Button, Container, Row, Col, InputGroup, Card } from "react-bootstrap"
import { X, Calendar } from "lucide-react"
import OrderHandle from "../OrderHandle"
import { XCircle } from "lucide-react"

export default function OrderEntry() {
  const [orderNumber, setOrderNumber] = useState("2024-0183075-NH")

  return (
    <Container fluid className="p-0">
      <div className="d-flex">
        {/* Sidebar */}
       <OrderHandle/>

        {/* Main Content */}
        <div className="flex-grow-1">
          {/* Header */}
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
            <h5 className="px-2">Order Entry</h5>
            <div className="bg-light border-top border-bottom py-2 px-3">
        <div className="d-inline-block">
          <span className="badge bg-white text-primary border p-2 d-flex align-items-center">
            <span className="fs-6">2024-0183075-NH</span>
            <button className="btn btn-sm text-danger border-0 p-0 ms-2">
              <XCircle size={16} />
            </button>
          </span>
        </div>
      </div>              
            </div>
            <div className="d-flex">
              <div className="me-2">
                <Form.Control type="text" placeholder="Property Address" size="sm" className="border-secondary" />
              </div>
              <div>
                <Form.Control
                  type="text"
                  placeholder="Search Property Address"
                  size="sm"
                  className="border-secondary"
                />
              </div>
            </div>
            <div>
              <Button variant="info" className="me-2 text-white">
                Save
              </Button>
              <Button variant="info" className="text-white">
                Cancel
              </Button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-3">
            <Row className="g-3">
              {/* First Column */}
              <Col md={6} className="fs-6">
                <Card className="h-100">
                  <Card.Body>
                    <Form>
                      <Row className="mb-2">
                        <Form.Group as={Col}>
                          <Form.Label className="small mb-1">Order Number</Form.Label>
                          <Form.Control size="sm"   value={orderNumber} 
                        onChange={(e) => setOrderNumber(e.target.value)} 
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label className="small mb-1">Open Date</Form.Label>
                          <InputGroup size="sm">
                            <Form.Control size="sm" value="08/05/2024" />
                            <Button variant="outline-secondary" size="sm">
                              <Calendar size={14} />
                            </Button>
                          </InputGroup>
                        </Form.Group>
                      </Row>

                      <Row className="mb-2">
                        <Form.Group as={Col}>
                          <Form.Label className="small mb-1">Closed Date</Form.Label>
                          <Form.Control size="sm" value="--" />
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label className="small mb-1">Due Date</Form.Label>
                          <InputGroup size="sm">
                            <Form.Control size="sm" value="08/05/2024 03:51 PM" />
                            <Button variant="outline-secondary" size="sm">
                              <Calendar size={14} />
                            </Button>
                          </InputGroup>
                        </Form.Group>
                      </Row>

                      <Row className="mb-2">
                        <Form.Group as={Col}>
                          <Form.Label className="small mb-1">Arrival Date*</Form.Label>
                          <InputGroup size="sm">
                            <Form.Control size="sm" value="08/05/2024" />
                            <Button variant="outline-secondary" size="sm">
                              <Calendar size={14} />
                            </Button>
                          </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label className="small mb-1">Delivery Date</Form.Label>
                          <Form.Control size="sm" value="--" />
                        </Form.Group>
                      </Row>

                      <Row className="mb-2">
                        <Form.Group as={Col}>
                          <Form.Label className="small mb-1">Active Workflow</Form.Label>
                          <Form.Control size="sm" value="Tax Processing" />
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label className="small mb-1">Assigned To</Form.Label>
                          <Form.Control size="sm" />
                        </Form.Group>
                      </Row>

                      <Row className="mb-2">
                        <Form.Group as={Col}>
                          <Form.Label className="small mb-1">Street Address*</Form.Label>
                          <Form.Control size="sm" value="47 Bog Road, Apt.G1" />
                        </Form.Group>
                        <Form.Group as={Col} md={4}>
                          <Form.Label className="small mb-1">Unit#</Form.Label>
                          <Form.Control size="sm" />
                        </Form.Group>
                      </Row>

                      <Row className="mb-2">
                        <Form.Group as={Col}>
                          <Form.Label className="small mb-1">City*</Form.Label>
                          <Form.Control size="sm" value="Concord" />
                        </Form.Group>
                      </Row>

                      <Row className="mb-2">
                        <Form.Group as={Col}>
                          <Form.Label className="small mb-1">ST*</Form.Label>
                          <Form.Control size="sm" value="New Hampshire" />
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label className="small mb-1">County*</Form.Label>
                          <Form.Control size="sm" value="Merrimack" />
                        </Form.Group>
                      </Row>

                      <Row className="mb-2">
                        <Form.Group as={Col}>
                          <Form.Label className="small mb-1">Zip code*</Form.Label>
                          <Form.Control size="sm" value="0000" />
                        </Form.Group>
                      </Row>

                      <Row className="mb-2">
                        <Form.Group as={Col}>
                          <Form.Label className="small mb-1">Parcel Id#</Form.Label>
                          <Form.Control size="sm" />
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label className="small mb-1">Sub Division</Form.Label>
                          <Form.Control size="sm" />
                        </Form.Group>
                      </Row>

                      <Row className="mb-2">
                        <Form.Group as={Col}>
                          <Form.Label className="small mb-1">Block</Form.Label>
                          <Form.Control size="sm" />
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label className="small mb-1">LOT</Form.Label>
                          <Form.Control size="sm" />
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label className="small mb-1">Section</Form.Label>
                          <Form.Control size="sm" />
                        </Form.Group>
                      </Row>

                      <Row className="mb-2">
                        <Form.Group as={Col}>
                          <Form.Label className="small mb-1">Land Value</Form.Label>
                          <InputGroup size="sm">
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control onChange={(e) => setLandValue(e.target.value)} size="sm" value="0.00" />
                          </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label className="small mb-1">Improvement Value</Form.Label>
                          <InputGroup size="sm">
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control size="sm" value="0.00"  onChange={(e) => setLandValue(e.target.value)}  
 />
                          </InputGroup>
                        </Form.Group>
                      </Row>

                      <Row className="mb-2">
                        <Form.Group as={Col} md={6}>
                          <Form.Label className="small mb-1">Total Assessed Value</Form.Label>
                          <InputGroup size="sm">
                            <InputGroup.Text>=</InputGroup.Text>
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control size="sm"   value="0.00" 
                            onChange={(e) => setOrderNumber(e.target.value)} 
                            />
                          </InputGroup>
                        </Form.Group>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>

              {/* Second Column */}
              <Col md={3} className="fs-6">
                <Card className="h-60">
                  <Card.Header className="bg-white py-2">
                    <h6 className="m-0">Order Setup</h6>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label className="small mb-1">Product Type*</Form.Label>
                        <Form.Control size="sm" value="Property Search" />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="small mb-1">Transaction Type*</Form.Label>
                        <Form.Control size="sm" value="Two Owner" />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="small mb-1">Workflow Group*</Form.Label>
                        <Form.Control size="sm" value="Online_TO_Plus" />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="small mb-1">Property Type</Form.Label>
                        <Form.Control size="sm" />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="small mb-1">Data Source*</Form.Label>
                        <Form.Control size="sm" value="Online" />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="small mb-1">Add-in Product/Service</Form.Label>
                        <InputGroup>
                          <Form.Control size="sm" />
                          <Button variant="info" size="sm" className="text-white">
                            <i className="bi bi-plus"></i>
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>

              {/* Third Column */}
              <Col md={3} className="fs-6">
                <Card className="h-60">
                  <Card.Header className="bg-white py-2">
                    <h6 className="m-0">Partners</h6>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label className="small mb-1">Abstractor</Form.Label>
                        <Form.Control size="sm" />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="small mb-1">Business Source</Form.Label>
                        <Form.Control size="sm" />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="small mb-1">Other Partner</Form.Label>
                        <Form.Control size="sm" />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="small mb-1">Other Source</Form.Label>
                        <Form.Control size="sm" />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="small mb-1">Recording Partner</Form.Label>
                        <Form.Control size="sm" />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="small mb-1">Tax Office</Form.Label>
                        <Form.Control size="sm" />
                      </Form.Group>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Container>
  )
}

