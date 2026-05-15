import { useState, useEffect } from 'react';
import { useLang } from '../../context/LangContext';
import { useTheme } from '../../context/ThemeContext';
import { getMesStats } from '../../api/societe';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Sidebar from '../../components/Sidebar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SocieteStats() {
  const { t } = useLang();
  const { modeSombre } = useTheme();

  const textColor = modeSombre ? '#e6edf6' : '#212529';
  const mutedColor = modeSombre ? '#8b96a8' : '#6c757d';
  const gridColor = modeSombre ? '#313a4f' : '#dee2e6';

  const [stats, setStats] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const charger = async () => {
      try {
        const data = await getMesStats();
        setStats(data);
      } catch (err) {
        setErreur(t('errors.general'));
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  const chartData = stats ? {
    labels: stats.offres_stats.map((o) => o.title.substring(0, 20) + '...'),
    datasets: [
      {
        label: t('stats.totalViews'),
        data: stats.offres_stats.map((o) => o.views_count),
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
        borderRadius: 6,
      },
      {
        label: t('stats.totalApplications'),
        data: stats.offres_stats.map((o) => o.candidatures_count),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderRadius: 6,
      },
      {
        label: t('stats.totalFavorites'),
        data: stats.offres_stats.map((o) => o.favoris_count),
        backgroundColor: 'rgba(245, 158, 11, 0.7)',
        borderRadius: 6,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: textColor } },
      title: { display: true, text: t('stats.chartTitle'), color: textColor },
    },
    scales: {
      x: { ticks: { color: mutedColor }, grid: { color: gridColor } },
      y: { beginAtZero: true, ticks: { color: mutedColor }, grid: { color: gridColor } },
    },
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">{t('nav.stats')}</h1>

        {erreur && <div className="alert alert-danger">{erreur}</div>}

        {chargement ? (
          <div className="text-center py-4"><div className="spinner-border text-primary"></div></div>
        ) : (
          <>
            {/* summary cards */}
            <div className="row g-3 mb-4">
              <div className="col-sm-4 col-lg-2">
                <div className="stat-card card-custom">
                  <div className="stat-card-icon bg-primary text-white"><i className="fas fa-list"></i></div>
                  <div>
                    <p className="stat-card-number">{stats?.total_offres}</p>
                    <p className="stat-card-label">{t('stats.totalOffers')}</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-4 col-lg-2">
                <div className="stat-card card-custom">
                  <div className="stat-card-icon bg-info text-white"><i className="fas fa-eye"></i></div>
                  <div>
                    <p className="stat-card-number">{stats?.total_vues}</p>
                    <p className="stat-card-label">{t('stats.totalViews')}</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-4 col-lg-2">
                <div className="stat-card card-custom">
                  <div className="stat-card-icon bg-success text-white"><i className="fas fa-users"></i></div>
                  <div>
                    <p className="stat-card-number">{stats?.total_candidatures}</p>
                    <p className="stat-card-label">{t('stats.totalApplications')}</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-4 col-lg-2">
                <div className="stat-card card-custom">
                  <div className="stat-card-icon bg-warning text-white"><i className="fas fa-hourglass"></i></div>
                  <div>
                    <p className="stat-card-number">{stats?.en_attente}</p>
                    <p className="stat-card-label">{t('stats.pending')}</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-4 col-lg-2">
                <div className="stat-card card-custom">
                  <div className="stat-card-icon bg-success text-white"><i className="fas fa-check"></i></div>
                  <div>
                    <p className="stat-card-number">{stats?.acceptes}</p>
                    <p className="stat-card-label">{t('stats.accepted')}</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-4 col-lg-2">
                <div className="stat-card card-custom">
                  <div className="stat-card-icon bg-danger text-white"><i className="fas fa-heart"></i></div>
                  <div>
                    <p className="stat-card-number">{stats?.total_favoris}</p>
                    <p className="stat-card-label">{t('stats.totalFavorites')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* chart */}
            {chartData && stats?.offres_stats.length > 0 && (
              <div className="card-custom p-4 mb-4">
                <div style={{ height: 320 }}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            )}

            <div className="row g-4">
              {/* top skills */}
              {stats?.top_skills && Object.keys(stats.top_skills).length > 0 && (
                <div className="col-lg-6">
                  <div className="card-custom p-4">
                    <h6 className="fw-bold mb-3" style={{ color: 'var(--text)' }}>
                      <i className="fas fa-code me-2 text-primary"></i>{t('stats.topSkills')}
                    </h6>
                    {Object.entries(stats.top_skills).map(([skill, count]) => {
                      const max = Math.max(...Object.values(stats.top_skills));
                      const pct = Math.round((count / max) * 100);
                      return (
                        <div key={skill} className="mb-2">
                          <div className="d-flex justify-content-between mb-1">
                            <small style={{ color: 'var(--text)', fontWeight: 500 }}>{skill}</small>
                            <small style={{ color: 'var(--text-muted)' }}>{count}</small>
                          </div>
                          <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary)', borderRadius: 4, transition: 'width 0.4s' }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* candidate cities */}
              {stats?.villes_candidats && stats.villes_candidats.length > 0 && (
                <div className="col-lg-6">
                  <div className="card-custom p-4">
                    <h6 className="fw-bold mb-3" style={{ color: 'var(--text)' }}>
                      <i className="fas fa-map-marker-alt me-2 text-primary"></i>{t('stats.candidateCities')}
                    </h6>
                    {stats.villes_candidats.map((v) => {
                      const max = Math.max(...stats.villes_candidats.map((x) => x.count));
                      const pct = Math.round((v.count / max) * 100);
                      return (
                        <div key={v.city} className="mb-2">
                          <div className="d-flex justify-content-between mb-1">
                            <small style={{ color: 'var(--text)', fontWeight: 500 }}>{v.city}</small>
                            <small style={{ color: 'var(--text-muted)' }}>{v.count}</small>
                          </div>
                          <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: '#f59e0b', borderRadius: 4, transition: 'width 0.4s' }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SocieteStats;
