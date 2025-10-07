<?php

declare(strict_types=1);

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;

class HealthTest extends TestCase
{
    /** @test */
    public function it_boots_the_framework()
    {
        $response = $this->get('/'); // default welcome route
        $response->assertStatus(200);
    }
}
