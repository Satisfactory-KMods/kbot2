import fs from 'fs';
import path from 'path';

export interface JobOptions {
	Interval: number;
	JobName: string;
	Task: (CallCount: number) => Promise<void>;
	DisableInitSync?: boolean;
}

export class JobTask {
	public JobName = '';
	protected Interval = 60000;
	protected Task: any;
	protected TaskFunction: (CallCount: number) => Promise<void>;
	protected TickCount = 1;
	protected IsRun = false;
	protected RunNextTask = [false, false];

	private constructor({ Interval, Task, JobName }: JobOptions) {
		this.JobName = JobName;
		this.Interval = Interval;
		this.TaskFunction = Task;
		this.Task = setInterval(this.Tick.bind(this), this.Interval);
	}

	static async ConstructJob(Options: JobOptions): Promise<JobTask> {
		const Job = new JobTask(Options);
		if (Options.DisableInitSync) {
			Job.Tick();
		} else {
			await Job.Tick();
		}
		SystemLib.Log('TASKS', 'Init run job:', SystemLib.ToBashColor('Red'), Options.JobName);
		return Job;
	}

	public UpdateTickTime(NewTime: number) {
		clearInterval(this.Task);
		this.Task = setInterval(this.Tick.bind(this), NewTime);
	}

	public DestroyTask() {
		clearInterval(this.Task);
	}

	public async ForceTask(ResetTime = false) {
		if (this.IsRun) {
			this.RunNextTask = [true, ResetTime];
		}

		await this.Tick();
		if (ResetTime) {
			this.DestroyTask();
			this.Task = setInterval(this.Tick.bind(this), this.Interval);
		}
	}

	protected async Tick() {
		this.IsRun = true;
		this.IsRun = false;
		await this.RunTask();
		this.TickCount++;
		if (this.TickCount >= 1000) {
			this.TickCount = 1;
		}

		if (this.RunNextTask[0]) {
			if (this.RunNextTask[1]) {
				this.DestroyTask();
				this.Task = setInterval(this.Tick.bind(this), this.Interval);
			}
			this.RunNextTask = [false, false];
			await this.Tick();
		}
	}

	protected async RunTask() {
		SystemLib.DebugLog('TASKS', 'Running Task', SystemLib.ToBashColor('Red'), this.JobName);
		await this.TaskFunction(this.TickCount);
	}
}

export class TaskManagerClass {
	public Jobs: Record<string, JobTask> = {};

	async Init() {
		for (const File of fs.readdirSync(path.join(__BaseDir, '/tasks/jobs'))) {
			const Stats = fs.statSync(path.join(__BaseDir, '/tasks/jobs', File));
			const jobName = File.replace('.Task.ts', '');
			if (Stats.isFile() && File.endsWith('.Task.ts') && !this.Jobs[jobName]) {
				const JobOptions: JobOptions = (await import(path.join(__BaseDir, '/tasks/jobs', File))).default;
				const JobClass = await JobTask.ConstructJob(JobOptions);
				this.Jobs[jobName] = JobClass;
			}
		}
	}

	RunTask(Task: string, ResetTimer = false) {
		if (this.Jobs[Task]) {
			this.Jobs[Task].ForceTask(ResetTimer).then((r) => {});
		}
	}
}
