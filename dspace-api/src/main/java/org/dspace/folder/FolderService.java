package org.dspace.folder;

import java.sql.SQLException;

import it.sauronsoftware.cron4j.TaskExecutor;

public interface FolderService {
	
	/**
	 * Init service
	 * @throws SQLException
	 */
	public void init() throws SQLException;
	
	/**
	 * Reloads schedules
	 * @throws SQLException 
	 */
	public void reloadSchedules() throws SQLException;
	
	/**
	 * Starts task execution
	 * @param id ID
	 * @return TaskExecutor
	 * @throws Exception
	 */
	public TaskExecutor execute(int id) throws Exception;
	
	/**
	 * Returns task alive status
	 * @param id Task ID
	 * @return Alive status
	 */
	public boolean isAliveTask(Integer id);
}
