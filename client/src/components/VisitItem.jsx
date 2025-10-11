import React from 'react';
import { Button } from './ui/base';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

const VisitItem = ({ visit, onView, onEdit, onDelete }) => {
    return (
        <li className="border rounded p-3 flex justify-between items-start">
            <div>
                <div className="text-sm text-gray-500">
                    {visit.date ? format(new Date(visit.date), 'PPP p') : '-'}
                </div>
                <div className="text-md font-medium">
                    {visit.purpose} <span className="text-sm text-gray-600">— {visit.type}</span>
                </div>
                {visit.summary && <p className="mt-1 text-sm">{visit.summary}</p>}
            </div>
            <div className="flex items-center gap-2">
                <Button size="small" variant="outline" onClick={() => onView(visit)}>View</Button>
                <Button size="small" variant="ghost" onClick={() => onEdit(visit)}>Edit</Button>
                <Button size="small" variant="danger" onClick={() => onDelete(visit._id)}>Delete</Button>
            </div>
        </li>
    );
};

VisitItem.propTypes = {
    visit: PropTypes.object.isRequired,
    onView: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
};

VisitItem.defaultProps = {
    onView: () => { },
    onEdit: () => { },
    onDelete: () => { },
};

export default VisitItem;