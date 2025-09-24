// import React from 'react';

// const Title = ({
//   Icon,
//   title,
//   className = '',
//   iconClassName = 'w-6 h-6',
//   titleClassName = 'text-2xl font-bold text-gray-900',
//   ...props
// }) => {
//   if (!title) return null; // Return null if no title is provided

//   return (
//     <div className={`flex items-center ${className}`}>
//       {Icon && (
//         <Icon className={`${iconClassName}`} /> // Use iconClassName here
//       )}
//       <h2 className={`${titleClassName} ${Icon ? 'ml-2' : ''}`}>
//         {title}
//       </h2>
//     </div>
//   );
// };

// export default Title;


import React from "react";

const Title = ({
  title,
  Icon, // Capitalized to indicate it's a component
  active,
  className = ''
}) => {
  return (
    <div className="flex items-center gap-2">
      {Icon && (
        <Icon className={`w-6 h-6 ${active ? 'text-blue-600' : 'text-gray-900'} ${className}`} />
      )}
      <h2 className={`text-2xl font-bold text-gray-900 ${className}`}>
        {title}
      </h2>
    </div>
  );
}

export default Title;

