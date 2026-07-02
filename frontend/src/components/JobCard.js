import React from 'react';

const JobCard = ({ job, onApply }) => {
  return (
    <div className='card' style={{ border: '1px solid #eee' }}>
      <h3 style={{ color: '#008751', marginBottom: '5px', fontSize: '20px' }}>
        {job.title}
      </h3>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
        🏢 {job.companyName} | 📍 {job.location} | 💼 {job.jobType}
      </p>
      <p style={{ color: '#444', marginBottom: '10px', lineHeight: '1.6' }}>
        {job.description}
      </p>
      {job.salary && (
        <p style={{ color: '#008751', fontWeight: 'bold', marginBottom: '10px' }}>
          💰 {job.salary}
        </p>
      )}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '15px' }}>
        {job.requirements?.map((req, i) => (
          <span key={i} style={{
            backgroundColor: '#f0f9f4',
            color: '#008751',
            padding: '3px 10px',
            borderRadius: '20px',
            fontSize: '13px'
          }}>
            {req}
          </span>
        ))}
      </div>
      {onApply && (
        <button
          className='btn btn-primary'
          onClick={() => onApply(job)}
        >
          Apply Now
        </button>
      )}
    </div>
  );
};

export default JobCard;