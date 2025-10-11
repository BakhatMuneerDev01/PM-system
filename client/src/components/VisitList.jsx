import VisitItem from './VisitItem';
import PropTypes from 'prop-types';

const VisitList = ({ visits = [], onView, onEdit, onDelete }) => {
    if (!visits || visits.length === 0) {
        return <p className="text-sm text-gray-500">No visits yet.</p>;
    }

    return (
        <ul className="space-y-3">
            {visits.map((v) => (
                <VisitItem key={v._id} visit={v} onView={onView} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </ul>
    );
};

VisitList.propTypes = {
    visits: PropTypes.array,
    onView: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
};

VisitList.defaultProps = {
    visits: [],
    onView: () => { },
    onEdit: () => { },
    onDelete: () => { },
};

export default VisitList;