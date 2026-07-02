import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const canvasRef = useRef(null);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const count = 80;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '0, 212, 170' : '108, 99, 255'
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.fill();
      });

      // Draw lines between close particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 212, 170, ${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <div style={{
        position: 'relative',
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Particle Canvas */}
        <canvas ref={canvasRef} style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          zIndex: 0
        }} />

        {/* Glow Orbs */}
        <div style={{
          position: 'absolute',
          width: '500px', height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)',
          top: '10%', left: '10%',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          width: '400px', height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)',
          bottom: '10%', right: '10%',
          zIndex: 0
        }} />

        {/* Hero Content */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '40px 20px',
          maxWidth: '800px'
        }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(0, 212, 170, 0.1)',
            border: '1px solid rgba(0, 212, 170, 0.3)',
            borderRadius: '20px',
            padding: '6px 16px',
            fontSize: '13px',
            color: '#00d4aa',
            fontWeight: '600',
            marginBottom: '24px',
            animation: 'fadeInUp 0.6s ease forwards'
          }}>
            🚀 AI-Powered Graduate Employment Platform
          </div>

          <h1 style={{
            fontSize: '56px',
            fontWeight: '800',
            lineHeight: '1.1',
            marginBottom: '24px',
            animation: 'fadeInUp 0.6s ease 0.1s forwards',
            opacity: 0
          }}>
            Bridge Your Career Gap with{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00d4aa, #6c63ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              AI Power
            </span>
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '40px',
            lineHeight: '1.7',
            animation: 'fadeInUp 0.6s ease 0.2s forwards',
            opacity: 0
          }}>
            Connecting FUT Minna graduates, alumni mentors and top employers
            through intelligent AI job matching and professional networking.
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            animation: 'fadeInUp 0.6s ease 0.3s forwards',
            opacity: 0
          }}>
            <Link to={user ? '/dashboard' : '/register'} style={{
              background: 'linear-gradient(135deg, #00d4aa, #6c63ff)',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '16px',
              textDecoration: 'none',
              transition: 'all 0.3s',
              boxShadow: '0 8px 30px rgba(0, 212, 170, 0.3)',
              display: 'inline-block'
            }}>
              {user ? 'Go to Dashboard →' : 'Get Started Free →'}
            </Link>
            <Link to='/jobs' style={{
              background: 'rgba(255,255,255,0.06)',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '16px',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.12)',
              transition: 'all 0.3s',
              display: 'inline-block'
            }}>
              Browse Jobs
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: '40px',
            justifyContent: 'center',
            marginTop: '60px',
            flexWrap: 'wrap',
            animation: 'fadeInUp 0.6s ease 0.4s forwards',
            opacity: 0
          }}>
            {[
              { number: '500+', label: 'Graduates' },
              { number: '200+', label: 'Jobs Posted' },
              { number: '50+', label: 'Employers' },
              { number: '100+', label: 'Alumni Mentors' }
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <h3 style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #00d4aa, #6c63ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {stat.number}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        padding: '100px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '40px',
            fontWeight: '800',
            marginBottom: '16px'
          }}>
            Everything You Need to{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00d4aa, #6c63ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Succeed
            </span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px' }}>
            Powerful features designed for FUT Minna graduates
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {[
            {
              icon: '🤖',
              title: 'AI Job Matching',
              description: 'Our AI analyzes your resume and skills to find the perfect job matches with detailed match scores and reasons.',
              color: '#00d4aa'
            },
            {
              icon: '📄',
              title: 'Smart Resume Parser',
              description: 'Upload your PDF resume and let AI automatically extract your skills, education, and experience.',
              color: '#6c63ff'
            },
            {
              icon: '💼',
              title: 'Job Opportunities',
              description: 'Browse hundreds of job opportunities posted by top employers looking for FUT Minna graduates.',
              color: '#00d4aa'
            },
            {
              icon: '🤝',
              title: 'Alumni Mentorship',
              description: 'Connect with FUT Minna alumni for guidance, mentorship and career advice through direct messaging.',
              color: '#6c63ff'
            },
            {
              icon: '📊',
              title: 'Application Tracking',
              description: 'Track all your job applications in one place and get real-time status updates from employers.',
              color: '#00d4aa'
            },
            {
              icon: '🔄',
              title: 'Multiple Roles',
              description: 'One account for everything. Switch between graduate, employer and alumni roles seamlessly.',
              color: '#6c63ff'
            }
          ].map((feature, i) => (
            <div key={i} className='card' style={{
              padding: '32px',
              animationDelay: `${i * 0.1}s`
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: `rgba(${feature.color === '#00d4aa' ? '0,212,170' : '108,99,255'}, 0.15)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '20px',
                border: `1px solid rgba(${feature.color === '#00d4aa' ? '0,212,170' : '108,99,255'}, 0.2)`
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '12px',
                color: feature.color
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: 'rgba(255,255,255,0.5)',
                lineHeight: '1.7',
                fontSize: '14px'
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        padding: '80px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(0,212,170,0.05), rgba(108,99,255,0.05))',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '40px',
            fontWeight: '800',
            marginBottom: '16px'
          }}>
            Ready to Launch Your{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00d4aa, #6c63ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Career?
            </span>
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '18px',
            marginBottom: '32px'
          }}>
            Join hundreds of FUT Minna graduates already using our platform
          </p>
          <Link to={user ? '/dashboard' : '/register'} style={{
            background: 'linear-gradient(135deg, #00d4aa, #6c63ff)',
            color: 'white',
            padding: '16px 40px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '16px',
            textDecoration: 'none',
            display: 'inline-block',
            boxShadow: '0 8px 30px rgba(0, 212, 170, 0.3)',
            transition: 'all 0.3s'
          }}>
            {user ? 'Go to Dashboard →' : 'Create Free Account →'}
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '24px 20px',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.3)',
        fontSize: '14px'
      }}>
        © 2024 FutMinna Portal — Federal University of Technology, Minna
      </div>
    </div>
  );
};

export default Home;