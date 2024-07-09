import { Pressable } from "react-native";
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GRAY, PRIMARY } from "../colors";

const HeaderRight = ({ disabled = false, onPress }) => {
    return (
        <Pressable hitSlop={10} disabled={disabled} onPress={onPress}>
            <MaterialCommunityIcons
                name='check'
                size={24}
                color={disabled ? GRAY.DEFAULT : PRIMARY.DEFAULT}
            />
        </Pressable>
    );
};

HeaderRight.propTypes = {
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
};

export default HeaderRight;