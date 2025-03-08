import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, FileText, Search, ChevronDown, Activity, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

interface TestRow {
  id: number;
  testName: string;
  methodology: string;
  value: string;
  units: string;
  refInterval: string;
}

interface PatientInfo {
  name: string;
  age: string;
  gender: string;
  mobile: string;
  referredBy: string;
  customReferrer: string;
  address: string;
  sampleDate: string;
  reportDate: string;
}

interface TestData {
  name: string;
  methodology: string;
  units: string;
  refInterval: string;
}

const ReportingPage: React.FC = () => {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: '',
    age: '',
    gender: 'Male',
    mobile: '',
    referredBy: 'self',
    customReferrer: '',
    address: '',
    sampleDate: new Date().toISOString().split('T')[0],
    reportDate: new Date().toISOString().split('T')[0]
  });

  const reportRef = useRef<HTMLDivElement>(null);
  const reportContentRef = useRef<HTMLDivElement>(null);
  const [mobileError, setMobileError] = useState<string>('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const validateMobileNumber = (number: string) => {
    const indianMobileRegex = /^[6-9]\d{9}$/;
    if (!number) {
      setMobileError('Mobile number is required');
      return false;
    }
    if (!indianMobileRegex.test(number)) {
      setMobileError('Please enter a valid 10-digit Indian mobile number');
      return false;
    }
    setMobileError('');
    return true;
  };

  const [testRows, setTestRows] = useState<TestRow[]>([
    {
      id: 1,
      testName: '',
      methodology: '',
      value: '',
      units: '',
      refInterval: ''
    }
  ]);

  const [showReport, setShowReport] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sample test data
  const testData: TestData[] = [
    { name: "TOTAL LEUCOCYTES COUNT (WBC)", methodology: "HF & FC", units: "X 10³ / µL", refInterval: "4.0 - 10.0" },
    { name: "NEUTROPHILS", methodology: "Flow Cytometry", units: "%", refInterval: "40-80" },
    { name: "LYMPHOCYTE", methodology: "Flow Cytometry", units: "%", refInterval: "20-40" },
    { name: "MONOCYTES", methodology: "Flow Cytometry", units: "%", refInterval: "2-10" },
    { name: "EOSINOPHILS", methodology: "Flow Cytometry", units: "%", refInterval: "1-6" },
    { name: "BASOPHILS", methodology: "Flow Cytometry", units: "%", refInterval: "0-2" },
    { name: "IMMATURE GRANULOCYTE PERCENTAGE(IG%)", methodology: "Flow Cytometry", units: "%", refInterval: "0-0.5" },
    { name: "NEUTROPHILS - ABSOLUTE COUNT", methodology: "Calculated", units: "X 10³ / µL", refInterval: "2.0-7.0" },
    { name: "LYMPHOCYTES - ABSOLUTE COUNT", methodology: "Calculated", units: "X 10³ / µL", refInterval: "1.0-3.0" },
    { name: "MONOCYTES - ABSOLUTE COUNT", methodology: "Calculated", units: "X 10³ / µL", refInterval: "0.2 - 1.0" },
    { name: "BASOPHILS - ABSOLUTE COUNT", methodology: "Calculated", units: "X 10³ / µL", refInterval: "0.02 - 0.1" },
    { name: "EOSINOPHILS - ABSOLUTE COUNT", methodology: "Calculated", units: "X 10³ / µL", refInterval: "0.02 - 0.5" },
    { name: "IMMATURE GRANULOCYTES(IG)", methodology: "Calculated", units: "X 10³ / µL", refInterval: "0-0.3" },
    { name: "TOTAL RBC", methodology: "HF & EI", units: "X 10^6/µL", refInterval: "4.5-5.5" },
    { name: "NUCLEATED RED BLOOD CELLS", methodology: "Calculated", units: "X 10³ / µL", refInterval: "0.0-0.5" },
    { name: "NUCLEATED RED BLOOD CELLS %", methodology: "Flow Cytometry", units: "%", refInterval: "0.0-5.0" },
    { name: "HEMOGLOBIN", methodology: "SLS-Hemoglobin Method", units: "g/dL", refInterval: "13.0-17.0" },
    { name: "HEMATOCRIT(PCV)", methodology: "CPH Detection", units: "%", refInterval: "40.0-50.0" },
    { name: "MEAN CORPUSCULAR VOLUME(MCV)", methodology: "Calculated", units: "fL", refInterval: "83.0-101.0" },
    { name: "MEAN CORPUSCULAR HEMOGLOBIN(MCH)", methodology: "Calculated", units: "pq", refInterval: "27.0-32.0" },
    { name: "MEAN CORP.HEMO.CONC(MCHC)", methodology: "Calculated", units: "g/dL", refInterval: "31.5-34.5" },
    { name: "RED CELL DISTRIBUTION WIDTH - SD(RDW-SD)", methodology: "Calculated", units: "fL", refInterval: "39-46" },
    { name: "RED CELL DISTRIBUTION WIDTH (RDW-CV)", methodology: "Calculated", units: "%", refInterval: "11.6-14" },
    { name: "PLATELET DISTRIBUTION WIDTH(PDW)", methodology: "Calculated", units: "fL", refInterval: "9.6-15.2" },
    { name: "MEAN PLATELET VOLUME(MPV)", methodology: "Calculated", units: "fL", refInterval: "6.5-12" },
    { name: "PLATELET COUNT", methodology: "HF & EI", units: "X 10³ / µL", refInterval: "150-410" },
    { name: "PLATELET TO LARGE CELL RATIO(PLCR)", methodology: "Calculated", units: "%", refInterval: "19.7-42.4" },
    { name: "PLATELETCRIT(PCT)", methodology: "Calculated", units: "%", refInterval: "0.19-0.39" }
  ];

  // Filter tests based on search term
  const filteredTests = searchTerm
    ? testData.filter(test =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : testData;

  // Handle click outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(null);
        setSearchTerm('');
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (showDropdown !== null && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showDropdown]);

  const handlePatientInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      // Only allow numbers
      const numbersOnly = value.replace(/[^0-9]/g, '');
      setPatientInfo(prev => ({
        ...prev,
        [name]: numbersOnly
      }));
      validateMobileNumber(numbersOnly);
    } else {
      setPatientInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTestRowChange = (id: number, field: keyof TestRow, value: string) => {
    setTestRows(prev =>
      prev.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const selectTest = (rowId: number, test: TestData) => {
    setTestRows(prev =>
      prev.map(row =>
        row.id === rowId ? {
          ...row,
          testName: test.name,
          methodology: test.methodology,
          units: test.units,
          refInterval: test.refInterval
        } : row
      )
    );
    setShowDropdown(null);
    setSearchTerm('');
  };

  const addTestRow = () => {
    const newId = testRows.length > 0 ? Math.max(...testRows.map(row => row.id)) + 1 : 1;
    setTestRows([...testRows, {
      id: newId,
      testName: '',
      methodology: '',
      value: '',
      units: '',
      refInterval: ''
    }]);
  };

  const removeTestRow = (id: number) => {
    if (testRows.length > 1) {
      setTestRows(testRows.filter(row => row.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateMobileNumber(patientInfo.mobile)) {
      return;
    }
    setShowReport(true);
  };

  const handleBack = () => {
    setShowReport(false);
  };

  const getEffectiveReferrer = () => {
    if (patientInfo.referredBy === 'self') {
      return 'Self';
    } else if (patientInfo.referredBy === 'custom') {
      return patientInfo.customReferrer;
    }
    return '';
  };

  const generatePDF = async () => {
    if (!reportContentRef.current) return;

    setIsGeneratingPDF(true);
    try {
      const reportElement = reportContentRef.current;
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 10; // 1 cm margin
      const imgHeight = (canvas.height * (imgWidth - 2 * margin)) / canvas.width;

      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = margin; // Start position with top margin

      // Add image to PDF with margins
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        margin,
        position,
        imgWidth - 2 * margin,
        imgHeight
      );

      // If the report is longer than one page
      while (imgHeight > pageHeight - 2 * margin) {
        position = position - pageHeight + 2 * margin;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL('image/jpeg', 1.0),
          'JPEG',
          margin,
          position,
          imgWidth - 2 * margin,
          imgHeight
        );
      }
      // Generate the PDF
      const pdfBlob = pdf.output('blob');
      const fileName = `${patientInfo.name}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      saveAs(pdfBlob, fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pathology Test Report</h1>

      {!showReport ? (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Patient Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Patient Name</label>
                <input
                  type="text"
                  name="name"
                  value={patientInfo.name}
                  onChange={handlePatientInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Age</label>
                <input
                  type="text"
                  name="age"
                  value={patientInfo.age}
                  onChange={handlePatientInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Gender</label>
                <select
                  name="gender"
                  value={patientInfo.gender}
                  onChange={handlePatientInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Mobile Number</label>
                <input
                  type="tel"
                  name="mobile"
                  value={patientInfo.mobile}
                  onChange={handlePatientInfoChange}
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${mobileError ? 'border-red-500' : 'border-gray-300'
                    }`}
                  required
                />
                {mobileError && (
                  <p className="text-red-500 text-xs mt-1">{mobileError}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Referred By</label>
                <div className="flex space-x-2">
                  <select
                    name="referredBy"
                    value={patientInfo.referredBy}
                    onChange={handlePatientInfoChange}
                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="self">Self</option>
                    <option value="custom">Doctor</option>
                  </select>
                  {patientInfo.referredBy === 'custom' && (
                    <input
                      type="text"
                      name="customReferrer"
                      value={patientInfo.customReferrer}
                      onChange={handlePatientInfoChange}
                      placeholder="Enter doctor's name"
                      className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={patientInfo.referredBy === 'custom'}
                    />
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-1">Address</label>
                <textarea
                  name="address"
                  value={patientInfo.address}
                  onChange={handlePatientInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Sample Collection Date</label>
                <input
                  type="date"
                  name="sampleDate"
                  value={patientInfo.sampleDate}
                  onChange={handlePatientInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Report Date</label>
                <input
                  type="date"
                  name="reportDate"
                  value={patientInfo.reportDate}
                  onChange={handlePatientInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Test Results</h2>
              <button
                type="button"
                onClick={addTestRow}
                className="flex items-center text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Test
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Test Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Methodology</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Value</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Units</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Bio. Ref. Interval</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="relative">
                  {testRows.map((row) => (
                    <tr key={row.id} className="border-b" style={{ height: '1cm' }}>
                      <td className="px-4 py-2">
                        <div className="relative">
                          <button
                            type="button"
                            className="w-full px-2 py-1 border border-gray-300 rounded-md flex justify-between items-center hover:border-blue-500 bg-white"
                            onClick={() => setShowDropdown(prev => prev === row.id ? null : row.id)}
                          >
                            <span className="truncate">{row.testName || "Select Test"}</span>
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          </button>

                          {showDropdown === row.id && (
                            <div
                              ref={dropdownRef}
                              className="fixed mt-1 w-[500px] bg-white border border-gray-300 rounded-md shadow-lg"
                              style={{
                                maxHeight: '400px',
                                overflowY: 'auto',
                                zIndex: 1000,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                top: '50%'
                              }}
                            >
                              <div className="sticky top-0 bg-white p-2 border-b" style={{ zIndex: 1001 }}>
                                <div className="flex items-center px-2 py-1 bg-gray-50 rounded-md">
                                  <Search className="h-4 w-4 text-gray-400 mr-2" />
                                  <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search tests..."
                                    className="w-full bg-transparent outline-none text-sm"
                                  />
                                </div>
                              </div>

                              {filteredTests.length > 0 ? (
                                filteredTests.map((test, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    className="w-full px-4 py-2 text-left hover:bg-blue-50 cursor-pointer text-sm"
                                    onClick={() => selectTest(row.id, test)}
                                  >
                                    {test.name}
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-2 text-gray-500 text-sm">No tests found</div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={row.methodology}
                          onChange={(e) => handleTestRowChange(row.id, 'methodology', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          readOnly
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={row.value}
                          onChange={(e) => handleTestRowChange(row.id, 'value', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          required
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={row.units}
                          onChange={(e) => handleTestRowChange(row.id, 'units', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          readOnly
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={row.refInterval}
                          onChange={(e) => handleTestRowChange(row.id, 'refInterval', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          readOnly
                        />
                      </td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => removeTestRow(row.id)}
                          className="text-red-500 hover:text-red-700"
                          disabled={testRows.length === 1}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Generate Report
            </button>
          </div>
        </form>
      ) : (
        <div ref={reportRef} className="bg-white shadow-md rounded-lg p-6">
          <div ref={reportContentRef}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-2xl font-bold text-blue-800">Saanvi Pathology Lab</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Report ID: SPL-{Math.floor(Math.random() * 10000)}</p>
                <p className="text-sm text-gray-600">Sample Date: {patientInfo.sampleDate}</p>
                <p className="text-sm text-gray-600">Report Date: {patientInfo.reportDate}</p>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-4 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Patient Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-sm"><span className="font-medium">Name:</span> {patientInfo.name}</p>
                  <p className="text-sm"><span className="font-medium">Age:</span> {patientInfo.age}</p>
                  <p className="text-sm"><span className="font-medium">Gender:</span> {patientInfo.gender}</p>
                  <p className="text-sm"><span className="font-medium">Mobile:</span> {patientInfo.mobile}</p>
                </div>
                <div>
                  <p className="text-sm"><span className="font-medium">Referred By:</span> {getEffectiveReferrer()}</p>
                  <p className="text-sm"><span className="font-medium">Address:</span> {patientInfo.address}</p>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-3">Test Results</h2>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">Test Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">Methodology</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">Value</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">Units</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">Bio. Ref. Interval</th>
                  </tr>
                </thead>
                <tbody>
                  {testRows.map((row) => {
                    const [min, max] = row.refInterval.split('-').map(Number);
                    const value = parseFloat(row.value);
                    const isOutOfRange = value < min || value > max;
                    return (
                      <tr key={row.id} className={`border-b ${isOutOfRange ? 'font-bold' : ''}`}>
                        <td className="px-4 py-2 border">{row.testName}</td>
                        <td className="px-4 py-2 border">{row.methodology}</td>
                        <td className="px-4 py-2 border font-medium">{row.value}</td>
                        <td className="px-4 py-2 border">{row.units}</td>
                        <td className="px-4 py-2 border">{row.refInterval}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-8">
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Notes & Interpretation</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This report contains laboratory test results. Please consult with your healthcare provider for interpretation and medical advice.
                </p>
              </div>

              <div className="text-start border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <div className="mb-4">
                    <p className="text-xs text-gray-500">
                      Saanvi Pathology Lab<br />
                      Seohara-Noorpur Road, Budhanpur(Bijnor)<br />
                      Phone: +91 9639739255, +91 8630897049<br />
                      Email: reports@saanvipathlab.com
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Dr. H. K. Sharma</p>
                    <p className="text-sm font-medium">D.M.I.T.(AGRA)</p>
                    <p className="text-xs text-gray-600">Laboratory Director</p>
                    <div className="mt-2 border-t border-gray-300 pt-1 inline-block px-8">
                      <p className="text-xs text-gray-500">Signature</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between print:hidden">
            <button
              onClick={handleBack}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
            >
              Back to Form
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 transition-colors flex items-center"
              >
                <FileText className="h-4 w-4 mr-1" /> Print
              </button>
              <button
                onClick={generatePDF}
                disabled={isGeneratingPDF}
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <Download className="h-4 w-4 mr-1" />
                {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportingPage;