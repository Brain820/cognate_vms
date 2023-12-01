import { useContext } from 'react';
import RecordingContext from '../RecordingProvider';

const useRecording = () => {
  return useContext(RecordingContext);
};

export default useRecording;
