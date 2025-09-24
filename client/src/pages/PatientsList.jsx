// import React, { useState, useMemo, useEffect } from 'react';
// import { Users, RefreshCcw, Eye, Edit } from 'lucide-react';
// import { Title, Button, Input, SearchBar, Sort, Table, Pagination } from '../components/ui/base';
// import { patients as dummyPatients } from '../data/dummyData';
// import MainLayout from '../components/layout/MainLayout';

// const PatientsList = () => {

//   const [patients, setPatients] = useState(dummyPatients);


//   const formateData = (date) => {
//     const d = new Date(date);
//     const day = d.getDate();
//     const month = d.getMonth() + 1;
//     const year = d.getFullYear();
//     return `${day}/${month}/${year}`;
//   }

//   const columns = [
//     { key: 'fullName', title: 'Full Name' },
//     { key: 'phoneNumber', title: 'Phone Number' },
//     { key: 'address', title: 'Address' },
//     { key: 'lastVisit', title: 'Last Visit' },
//     { key: 'actions', title: 'Actions' }
//   ]

//   const actions = [
//     { key: 'view', title: 'View', Icon: Eye, onClick: (p) => console.log('View', p) },
//     { key: 'edit', title: 'Edit', Icon: Edit, onClick: (p) => console.log('Edit', p) },
//   ]

//   // 1) Build tableData BEFORE any state that depends on it
//   const tableData = () => {
//     return patients.map((patient) => ({
//       fullName: patient.fullName,
//       address: patient.address,
//       phoneNumber: patient.phoneNumber,
//       lastVisit: formateData(patient.lastVisit)
//     }))
//   };

//   // let's write pagination functionality
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstIetm = indexOfLastItem - itemsPerPage;
//   const totalPages = Math.cell(patients.length / itemsPerPage);
//   const currentPatients = [...tableData].slice(indexOfFirstIetm, indexOfLastItem);

//   const pagination = () => {
//     return {
//       indexOfFirstIetm,
//       indexOfLastItem,
//       totalPages,
//       currentPage,
//       currentPatients,
//       onPrevious: () => {
//         if(currentPage > 1) {
//           setCurrentPage(currentPage - 1);
//         }
//       },
//       onNext: () => {
//         if(currentPage < totalPages) {
//           setCurrentPage(currentPage + 1);
//         }
//       },
//       onPageChange: (page) => {
//         setCurrentPage(page)
//       }
//     }
//   }

//   // sort patients by name or last visit


//   return (
//     <MainLayout>
//       <div className='container px-8 py-6 bg-white'>
//         <div className='flex justify-between items-center'>
//           <Title title='Patients List' Icon={Users} active={true} />
//           <div className='flex items-center gap-2'>
//             <SearchBar />
//             <Sort />
//             <Button variant='outline' size='md'>
//               <RefreshCcw className='w-4 h-4 mr-2' />
//               <span>Refresh</span>
//             </Button>
//           </div>
//         </div>
//       </div>
//     </MainLayout>
//   )
// }

// export default PatientsList;



// import React, { useState, useMemo } from 'react';
// import { Users, RefreshCcw, Eye, Edit } from 'lucide-react';
// import { Title, Button, Table, Pagination, SearchBar, Sort } from '../components/ui/base';
// import { patients as dummyPatients } from '../data/dummyData';
// import MainLayout from '../components/layout/MainLayout';

// const PatientsList = () => {
//   const [patients, setPatients] = useState(dummyPatients);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortBy, setSortBy] = useState('name');
//   const [searchTerm, setSearchTerm] = useState('');

//   const formatDate = (date) => {
//     const d = new Date(date);
//     return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
//   };

//   // ✅ Filter by search term (name or phone)
//   const filteredPatients = useMemo(() => {
//     if (!searchTerm.trim()) return patients;
//     return patients.filter(
//       (p) =>
//         p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         p.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [patients, searchTerm]);

//   // ✅ Sort
//   const sortedPatients = useMemo(() => {
//     const arr = [...filteredPatients];
//     if (sortBy === 'name') {
//       arr.sort((a, b) => a.fullName.localeCompare(b.fullName));
//     } else if (sortBy === 'lastVisit') {
//       arr.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));
//     }
//     return arr;
//   }, [filteredPatients, sortBy]);

//   // ✅ Pagination
//   const itemsPerPage = 5;
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const totalPages = Math.ceil(sortedPatients.length / itemsPerPage);
//   const currentPatients = sortedPatients.slice(indexOfFirstItem, indexOfLastItem);

//   const tableData = currentPatients.map((patient) => ({
//     fullName: patient.fullName,
//     address: patient.address,
//     phoneNumber: patient.phoneNumber,
//     lastVisit: formatDate(patient.lastVisit),
//   }));

//   const columns = [
//     { key: 'fullName', title: 'Full Name' },
//     { key: 'phoneNumber', title: 'Phone Number' },
//     { key: 'address', title: 'Address' },
//     { key: 'lastVisit', title: 'Last Visit' },
//   ];

//   const actions = [
//     { key: 'view', title: 'View', Icon: Eye, onClick: (p) => console.log('View', p) },
//     { key: 'edit', title: 'Edit', Icon: Edit, onClick: (p) => console.log('Edit', p) },
//   ];

//   const handleRefresh = () => {
//     setPatients(dummyPatients);
//     setSearchTerm('');
//     setSortBy('name');
//     setCurrentPage(1);
//   };

//   return (
//     <MainLayout>
//       <div className="container px-8 py-6 bg-white">
//         <div className="flex justify-between items-center mb-6">
//           <Title title="Patients List" Icon={Users} active={true} />
//           <div className="flex items-center gap-2">
//             <SearchBar value={searchTerm} onChange={setSearchTerm} /> {/* ✅ Search */}
//             <Sort sortBy={sortBy} onChange={setSortBy} />
//             <Button variant="outline" size="md" onClick={handleRefresh}>
//               <RefreshCcw className="w-4 h-4 mr-2" />
//               <span>Refresh</span>
//             </Button>
//           </div>
//         </div>

//         <Table columns={columns} data={tableData} actions={actions} />

//         <Pagination
//           from={indexOfFirstItem + 1}
//           to={Math.min(indexOfLastItem, sortedPatients.length)}
//           total={sortedPatients.length}
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//           onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//           onPageChange={(page) => setCurrentPage(page)}
//         />
//       </div>
//     </MainLayout>
//   );
// };

// export default PatientsList;

// components/pages/PatientsList.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, RefreshCcw, Eye, Edit } from 'lucide-react';
import { Title, Button, Table, Pagination, SearchBar, Sort } from '../components/ui/base';
import { patients as dummyPatients } from '../data/dummyData';
import MainLayout from '../components/layout/MainLayout';

const PatientsList = () => {
  const [patients, setPatients] = useState(dummyPatients);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  // Filter by search term (name or phone)
  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) return patients;
    return patients.filter(
      (p) =>
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

  // Sort
  const sortedPatients = useMemo(() => {
    const arr = [...filteredPatients];
    if (sortBy === 'name') {
      arr.sort((a, b) => a.fullName.localeCompare(b.fullName));
    } else if (sortBy === 'lastVisit') {
      arr.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));
    }
    return arr;
  }, [filteredPatients, sortBy]);

  // Pagination
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(sortedPatients.length / itemsPerPage);
  const currentPatients = sortedPatients.slice(indexOfFirstItem, indexOfLastItem);

  const tableData = currentPatients.map((patient) => ({
    id: patient.id,
    fullName: patient.fullName,
    address: patient.address,
    phoneNumber: patient.phoneNumber,
    lastVisit: formatDate(patient.lastVisit),
  }));

  const columns = [
    { key: 'fullName', title: 'Full Name' },
    { key: 'phoneNumber', title: 'Phone Number' },
    { key: 'address', title: 'Address' },
    { key: 'lastVisit', title: 'Last Visit' },
  ];

  const actions = [
    {
      key: 'view',
      title: 'View',
      Icon: Eye,
      onClick: (patient) => navigate(`/patients/${patient.id}`)
    },
    {
      key: 'edit',
      title: 'Edit',
      Icon: Edit,
      onClick: (patient) => console.log('Edit', patient)
    },
  ];

  // const handleRowClick = (patient) => {
  //   navigate(`/patients/${patient.id}`);
  // };

  const handleRefresh = () => {
    setPatients(dummyPatients);
    setSearchTerm('');
    setSortBy('name');
    setCurrentPage(1);
  };

  return (
    <MainLayout>
      <div className="container px-8 py-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <Title title="Patients List" Icon={Users} active={true} />
          <div className="flex items-center gap-2">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <Sort sortBy={sortBy} onChange={setSortBy} />
            <Button variant="outline" size="md" onClick={handleRefresh}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          data={tableData}
          actions={actions}
        />

        <Pagination
          from={indexOfFirstItem + 1}
          to={Math.min(indexOfLastItem, sortedPatients.length)}
          total={sortedPatients.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </MainLayout>
  );
};

export default PatientsList;