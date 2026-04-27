import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './AppSidebar.module.css';

const AppSidebar = ({ navigationItems, user }) => {
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        <img src={"./IAMSlogo.png"} alt="IAMS" className={styles.logoImage} />
        <span className={styles.logoLabel}>IAMS</span>
      </div>
      
      {navigationItems.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <span className={styles.navSectionLabel}>{section.title}</span>
          {section.items.map((item, itemIndex) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={itemIndex}
                to={item.to}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
      
      {user && (
        <div className={styles.sidebarBottom}>
          <Link to="/profile" className={styles.userChip}>
            <div className={styles.avatar}>{user.initials}</div>
            <div>
              <div className={styles.uname}>{user.name}</div>
              <div className={styles.urole}>{user.role}</div>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
};

export default AppSidebar;
