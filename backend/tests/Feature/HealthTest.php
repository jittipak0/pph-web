<?php

declare(strict_types=1);

use Tests\TestCase;

class HealthTest extends TestCase
{
    /** @test */
    public function health_endpoint_returns_ok_true()
    {
        $response = $this->get('/api/health');
        $response->assertOk();
        $response->assertJson(['ok' => true]);
    }
}
