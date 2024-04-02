// /* eslint-disable react/no-array-index-key */
// /* eslint-disable react/destructuring-assignment */
// import React from 'react';
// import { Box, Button, Heading, Image, Text } from '@chakra-ui/react';
// import ViewColumnIcon from '@mui/icons-material/ViewColumn';
// import { useNavigate } from 'react-router-dom';

// function Snapshots(props) {
//   const navigate = useNavigate();
//   const { snaps, setMulti } = props;
//   const imageName = (imagePath) => {
//     return imagePath.split('/').pop().replace('.png', '');
//   }
//   return (
//     <Box className="snapshot" paddingBottom="2rem">
//       <Box display="flex" alignItems="center" justifyContent="space-between">
//         <Heading>Snapshots</Heading>
//         <Button onClick={() => setMulti(true)}>
//           <ViewColumnIcon fontSize="large" />
//         </Button>
//       </Box>
//       <Box className="media-container">
//         {snaps.map((item, i) => (
//           <Box key={i}>
//             <Box
//               className="media"
//               onClick={() =>
//                 navigate(`/images/${item.image_id}?image_file=file:${item.image_file}`)
//               }
//               position="relative"
//             >
//               <Image
//                 src={'file://' + `${item.image_file}`}
//                 alt="Screenshot not visible"
//               />
//               <Text background="red" width="2rem" borderTopLeftRadius="0.5rem" textAlign="center" fontSize="1.5rem" color="white" position="absolute" top="0">{item.image_id}</Text>
//             </Box>
//             <Text width="100%" borderBottomLeftRadius="0.5rem" borderBottomRightRadius="0.5rem" background="#0350a4" color="white" textAlign="center" className="vedio-name" fontSize="1.5rem">{imageName(item.image_file)}</Text>
//           </Box>
//         ))}
//       </Box>
//     </Box>
//   );
// }

// export default Snapshots;


/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Box, Button, Heading, Image, Text } from '@chakra-ui/react';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { useNavigate } from 'react-router-dom';

function Snapshots(props) {
  const navigate = useNavigate();
  const { snaps, setMulti } = props;
  const imageName = (imagePath) => {
    return imagePath.split('/').pop().replace('.png', '');
  }
  return (
    <Box className="snapshot" paddingBottom="2rem">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Heading>Snapshots</Heading>
        <Button onClick={() => setMulti(true)}>
          <ViewColumnIcon fontSize="large" />
        </Button>
      </Box>
      <Box className="media-container">
        {snaps.map((item, i) => (
          <Box key={i}>
            <Box
              className="media"
              onClick={() =>
                navigate(`/images/${item.image_id}?image_file=file:${item.image_file}`)
              }
              position="relative"
            >
              <Image
                src={'file://' + `${item.image_file}`}
                alt="Screenshot not visible"
              />
            </Box>
            <Text width="100%" borderBottomLeftRadius="0.5rem" borderBottomRightRadius="0.5rem" background="#0350a4" color="white" textAlign="center" className="vedio-name" fontSize="1.5rem">
                {item.image_id} || {imageName(item.image_file)}
              </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Snapshots;
